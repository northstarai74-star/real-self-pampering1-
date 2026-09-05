// Server-only. Reads and writes the certificate register as JSON on disk.
// Works when this app runs under Node (vite dev / vite preview / a Node server).
// A serverless/edge deploy target (e.g. Cloudflare Workers) has no filesystem —
// swap this for a real database (D1, KV, etc.) before deploying there.

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

export type Certificate = {
  id: string;
  number: string;
  holder: string;
  course: string;
  issued: string;
  expires: string;
  level: string;
};

const DATA_DIR = path.resolve(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "certificates.json");

const SEED_CERTIFICATES: Certificate[] = [
  {
    id: "cert-1",
    number: "SP-2024-0118",
    holder: "Amara Lindqvist",
    course: "Gel Manicure & Nail Preparation",
    issued: "18 March 2024",
    expires: "18 March 2027",
    level: "Foundation",
  },
  {
    id: "cert-2",
    number: "SP-2024-0247",
    holder: "Noor Haddad",
    course: "Structured Gel Extensions",
    issued: "02 June 2024",
    expires: "02 June 2027",
    level: "Advanced",
  },
  {
    id: "cert-3",
    number: "SP-2024-0316",
    holder: "Elin Vasquez",
    course: "Editorial Nail Art & Hand Painting",
    issued: "27 August 2024",
    expires: "27 August 2027",
    level: "Advanced",
  },
  {
    id: "cert-4",
    number: "SP-2025-0032",
    holder: "Priya Raghavan",
    course: "Russian Manicure & Cuticle Care",
    issued: "14 January 2025",
    expires: "14 January 2028",
    level: "Specialist",
  },
  {
    id: "cert-5",
    number: "SP-2025-0104",
    holder: "Sofia Marchetti",
    course: "Chrome, Cat-Eye & Reflective Finishes",
    issued: "09 April 2025",
    expires: "09 April 2028",
    level: "Specialist",
  },
  {
    id: "cert-6",
    number: "SP-2025-0189",
    holder: "Jade Okonkwo",
    course: "Bridal Nail Design",
    issued: "21 May 2025",
    expires: "21 May 2028",
    level: "Advanced",
  },
  {
    id: "cert-7",
    number: "SP-2025-0233",
    holder: "Camille Rousseau",
    course: "Pedicure & Foot Care Protocols",
    issued: "07 July 2025",
    expires: "07 July 2028",
    level: "Foundation",
  },
  {
    id: "cert-8",
    number: "SP-2026-0011",
    holder: "Mei Tanaka",
    course: "Master Trainer — Nail Artistry",
    issued: "12 February 2026",
    expires: "12 February 2029",
    level: "Master",
  },
];

async function ensureDataFile(): Promise<void> {
  if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
  if (!existsSync(DATA_FILE)) {
    await writeFile(DATA_FILE, `${JSON.stringify(SEED_CERTIFICATES, null, 2)}\n`, "utf8");
  }
}

export async function readCertificates(): Promise<Certificate[]> {
  await ensureDataFile();
  const raw = await readFile(DATA_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Certificate[]) : [];
  } catch {
    return [];
  }
}

export async function writeCertificates(list: Certificate[]): Promise<void> {
  await ensureDataFile();
  await writeFile(DATA_FILE, `${JSON.stringify(list, null, 2)}\n`, "utf8");
}

export function createCertificateId(): string {
  return randomUUID();
}

const normalise = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, " ").replace(/[‐-―]/g, "-");

const normaliseNumber = (value: string) => normalise(value).replace(/[\s-]/g, "");

export type VerificationResult =
  | { status: "valid"; certificate: Certificate }
  | { status: "name_mismatch"; certificate: Certificate }
  | { status: "not_found" };

export function matchCertificate(
  list: Certificate[],
  numberInput: string,
  nameInput: string,
): VerificationResult {
  const wantedNumber = normaliseNumber(numberInput);
  const wantedName = normalise(nameInput);

  const match = list.find((c) => normaliseNumber(c.number) === wantedNumber);
  if (!match) return { status: "not_found" };
  if (normalise(match.holder) !== wantedName) {
    return { status: "name_mismatch", certificate: match };
  }
  return { status: "valid", certificate: match };
}
