// Server-only. Stores customer contact-form messages.
//
// Supabase is used when VITE_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set.
// Without them we fall back to the same JSON-on-disk store the certificate
// register uses, so messages survive at least as long as the running instance
// and the owner can still read them in the admin dashboard.

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

import { supabase, type CustomerQuery } from "./supabase.server";

export type { CustomerQuery };

const TABLE = "customer_queries";
const DATA_DIR =
  process.env["NODE_ENV"] === "production" ? "/tmp/queries" : path.resolve(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "queries.json");

// Last resort when neither Supabase nor the filesystem is writable (edge runtimes).
let memoryQueries: CustomerQuery[] = [];

async function readFromDisk(): Promise<CustomerQuery[]> {
  if (!existsSync(DATA_FILE)) return [];
  const raw = await readFile(DATA_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as CustomerQuery[]) : [];
  } catch {
    return [];
  }
}

async function writeToDisk(list: CustomerQuery[]): Promise<void> {
  if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, `${JSON.stringify(list, null, 2)}\n`, "utf8");
}

export type NewQuery = {
  name: string;
  email: string;
  phone: string | null;
  message: string;
};

export async function addQuery(input: NewQuery): Promise<CustomerQuery> {
  const record: CustomerQuery = {
    id: randomUUID(),
    ...input,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    const { error } = await supabase.from(TABLE).insert([input]);
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);
    return record;
  }

  try {
    const list = await readFromDisk();
    list.push(record);
    await writeToDisk(list);
  } catch (error) {
    console.error("Could not persist query to disk, keeping it in memory:", error);
    memoryQueries.push(record);
  }
  return record;
}

export async function listQueries(): Promise<CustomerQuery[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Supabase select failed: ${error.message}`);
    return (data as CustomerQuery[] | null) ?? [];
  }

  let list: CustomerQuery[] = [];
  try {
    list = await readFromDisk();
  } catch (error) {
    console.error("Could not read queries from disk:", error);
  }
  return [...list, ...memoryQueries].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function removeQuery(id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw new Error(`Supabase delete failed: ${error.message}`);
    return;
  }

  memoryQueries = memoryQueries.filter((q) => q.id !== id);
  try {
    const list = await readFromDisk();
    const next = list.filter((q) => q.id !== id);
    if (next.length !== list.length) await writeToDisk(next);
  } catch (error) {
    console.error("Could not delete query from disk:", error);
  }
}
