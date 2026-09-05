import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { isValidAdminPassword } from "@/lib/admin-auth.server";
import {
  createCertificateId,
  matchCertificate,
  readCertificates,
  writeCertificates,
  type Certificate,
  type VerificationResult,
} from "@/lib/certificates-store.server";

export type { Certificate, VerificationResult };

class UnauthorizedError extends Error {
  constructor() {
    super("Incorrect admin password.");
  }
}

function requireAdmin(password: string) {
  if (!isValidAdminPassword(password)) throw new UnauthorizedError();
}

const certificateFieldsSchema = z.object({
  number: z.string().trim().nonempty().max(40),
  holder: z.string().trim().nonempty().max(80),
  course: z.string().trim().nonempty().max(120),
  issued: z.string().trim().nonempty().max(40),
  expires: z.string().trim().nonempty().max(40),
  level: z.string().trim().nonempty().max(40),
});

// Public — used by the site's "verify a certificate" form. Only ever returns
// the single matching record (or a not-found/mismatch status), never the list.
const verifySchema = z.object({
  number: z.string().max(40),
  name: z.string().max(80),
});

export const verifyCertificatePublic = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof verifySchema>) => verifySchema.parse(input))
  .handler(async ({ data }) => {
    const list = await readCertificates();
    return matchCertificate(list, data.number, data.name);
  });

// --- Admin-only below: every call re-checks the password server-side. ---

const loginSchema = z.object({ password: z.string() });

export const adminLogin = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof loginSchema>) => loginSchema.parse(input))
  .handler(async ({ data }) => ({ ok: isValidAdminPassword(data.password) }));

const listSchema = z.object({ password: z.string() });

export const adminListCertificates = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof listSchema>) => listSchema.parse(input))
  .handler(async ({ data }) => {
    requireAdmin(data.password);
    const list = await readCertificates();
    return [...list].sort((a, b) => b.issued.localeCompare(a.issued));
  });

const addSchema = z.object({
  password: z.string(),
  certificate: certificateFieldsSchema,
});

export const adminAddCertificate = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof addSchema>) => addSchema.parse(input))
  .handler(async ({ data }) => {
    requireAdmin(data.password);
    const list = await readCertificates();
    const newCertificate: Certificate = { id: createCertificateId(), ...data.certificate };
    await writeCertificates([...list, newCertificate]);
    return newCertificate;
  });

const updateSchema = z.object({
  password: z.string(),
  id: z.string(),
  certificate: certificateFieldsSchema,
});

export const adminUpdateCertificate = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof updateSchema>) => updateSchema.parse(input))
  .handler(async ({ data }) => {
    requireAdmin(data.password);
    const list = await readCertificates();
    const index = list.findIndex((c) => c.id === data.id);
    if (index === -1) throw new Error("That certificate no longer exists.");
    const updated: Certificate = { id: data.id, ...data.certificate };
    const next = [...list];
    next[index] = updated;
    await writeCertificates(next);
    return updated;
  });

const deleteSchema = z.object({ password: z.string(), id: z.string() });

export const adminDeleteCertificate = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof deleteSchema>) => deleteSchema.parse(input))
  .handler(async ({ data }) => {
    requireAdmin(data.password);
    const list = await readCertificates();
    const next = list.filter((c) => c.id !== data.id);
    if (next.length === list.length) throw new Error("That certificate no longer exists.");
    await writeCertificates(next);
    return { ok: true as const };
  });
