import { createServerFn } from "@tanstack/react-start";
import { getAdminPassword } from "./admin-auth.server";

const QUERIES_FILE = "queries.json";

interface CustomerQuery {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  date: string;
}

function getQueriesPath() {
  return `/tmp/sp-queries.json`;
}

function readQueries(): CustomerQuery[] {
  try {
    const fs = require("fs");
    const path = getQueriesPath();
    if (fs.existsSync(path)) {
      const data = fs.readFileSync(path, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading queries:", error);
  }
  return [];
}

function writeQueries(queries: CustomerQuery[]) {
  try {
    const fs = require("fs");
    const path = getQueriesPath();
    fs.writeFileSync(path, JSON.stringify(queries, null, 2));
  } catch (error) {
    console.error("Error writing queries:", error);
    throw new Error("Failed to save query");
  }
}

export const submitCustomerQuery = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as { name: string; email: string; phone?: string; message: string };
    if (!d.name?.trim() || !d.email?.trim() || !d.message?.trim()) {
      throw new Error("Invalid query data");
    }
    return d;
  })
  .handler(async (data) => {
    try {
      const queries = readQueries();
      const newQuery: CustomerQuery = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        message: data.message,
        date: new Date().toISOString(),
      };
      queries.push(newQuery);
      writeQueries(queries);
      return { ok: true };
    } catch (error) {
      console.error("Error submitting query:", error);
      return { ok: false };
    }
  });

export const getCustomerQueries = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    const d = data as { password: string };
    if (d.password !== getAdminPassword()) {
      throw new Error("Unauthorized");
    }
    return d;
  })
  .handler(async () => {
    try {
      return readQueries();
    } catch (error) {
      console.error("Error fetching queries:", error);
      return [];
    }
  });

export const deleteCustomerQuery = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as { id: string; password: string };
    if (d.password !== getAdminPassword()) {
      throw new Error("Unauthorized");
    }
    if (!d.id) {
      throw new Error("Invalid query id");
    }
    return d;
  })
  .handler(async (data) => {
    try {
      const queries = readQueries();
      const filtered = queries.filter((q) => q.id !== data.id);
      writeQueries(filtered);
      return { ok: true };
    } catch (error) {
      console.error("Error deleting query:", error);
      return { ok: false };
    }
  });
