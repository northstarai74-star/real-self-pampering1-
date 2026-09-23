import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { isValidAdminPassword } from "@/lib/admin-auth.server";
import { addQuery, listQueries, removeQuery, type CustomerQuery } from "@/lib/queries-store.server";

export type { CustomerQuery };

function requireAdmin(password: string) {
  if (!isValidAdminPassword(password)) throw new Error("Unauthorized");
}

// Public — used by the site's contact form.
const submitSchema = z.object({
  name: z.string().trim().nonempty("Please enter your name.").max(80),
  email: z.string().trim().email("Please enter a valid email address.").max(120),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().nonempty("Please enter a message.").max(2000),
});

export type SubmitQueryInput = z.input<typeof submitSchema>;
export type SubmitQueryResult = { ok: true } | { ok: false; error: string };

export const submitCustomerQuery = createServerFn({ method: "POST" })
  .validator((input: SubmitQueryInput) => submitSchema.parse(input))
  .handler(async ({ data }): Promise<SubmitQueryResult> => {
    try {
      await addQuery({
        name: data.name,
        email: data.email,
        phone: data.phone?.trim() || null,
        message: data.message,
      });
      return { ok: true };
    } catch (error) {
      console.error("Error submitting query:", error);
      return { ok: false, error: "We could not save your message. Please try again." };
    }
  });

// --- Admin-only below: every call re-checks the password server-side. ---

const listSchema = z.object({ password: z.string() });

export const getCustomerQueries = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof listSchema>) => listSchema.parse(input))
  .handler(async ({ data }): Promise<CustomerQuery[]> => {
    requireAdmin(data.password);
    return listQueries();
  });

const deleteSchema = z.object({ password: z.string(), id: z.string().nonempty() });

export const deleteCustomerQuery = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof deleteSchema>) => deleteSchema.parse(input))
  .handler(async ({ data }) => {
    requireAdmin(data.password);
    await removeQuery(data.id);
    return { ok: true as const };
  });
