import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { isValidAdminPassword } from "./admin-auth.server";
import { supabase, type CustomerQuery } from "./supabase.server";

class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
  }
}

function requireAdmin(password: string) {
  if (!isValidAdminPassword(password)) throw new UnauthorizedError();
}

// In-memory fallback storage, used only when Supabase is not configured.
// Note: on serverless hosting this lives for the life of a single instance.
const queriesStore: Map<string, CustomerQuery[]> = new Map();
queriesStore.set("queries", []);

function getFallbackQueries(): CustomerQuery[] {
  return queriesStore.get("queries") || [];
}

function setFallbackQueries(queries: CustomerQuery[]) {
  queriesStore.set("queries", queries);
}

const submitSchema = z.object({
  name: z.string().trim().nonempty("Please enter your name.").max(80),
  email: z.string().trim().email("Please enter a valid email address.").max(120),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().nonempty("Please enter a message.").max(2000),
});

export const submitCustomerQuery = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof submitSchema>) => submitSchema.parse(input))
  .handler(async ({ data }) => {
    const cleanData = {
      name: data.name,
      email: data.email,
      phone: data.phone ? data.phone : null,
      message: data.message,
    };

    try {
      if (supabase) {
        const { error } = await supabase.from("customer_queries").insert([cleanData]);
        if (error) {
          console.error("Supabase error saving customer query:", error);
          return { ok: false as const };
        }
        return { ok: true as const };
      }

      const queries = getFallbackQueries();
      const newQuery: CustomerQuery = {
        id: Date.now().toString(),
        ...cleanData,
        created_at: new Date().toISOString(),
      };
      setFallbackQueries([...queries, newQuery]);
      return { ok: true as const };
    } catch (error) {
      console.error("Error submitting query:", error);
      return { ok: false as const };
    }
  });

const listSchema = z.object({ password: z.string() });

export const getCustomerQueries = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof listSchema>) => listSchema.parse(input))
  .handler(async ({ data }): Promise<CustomerQuery[]> => {
    requireAdmin(data.password);

    try {
      if (supabase) {
        const { data: rows, error } = await supabase
          .from("customer_queries")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error fetching customer queries:", error);
          return getFallbackQueries();
        }

        return (rows as CustomerQuery[] | null) ?? [];
      }

      return [...getFallbackQueries()].sort((a, b) => b.created_at.localeCompare(a.created_at));
    } catch (error) {
      console.error("Error fetching queries:", error);
      return getFallbackQueries();
    }
  });

const deleteSchema = z.object({ password: z.string(), id: z.string().nonempty() });

export const deleteCustomerQuery = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof deleteSchema>) => deleteSchema.parse(input))
  .handler(async ({ data }) => {
    requireAdmin(data.password);

    try {
      if (supabase) {
        const { error } = await supabase.from("customer_queries").delete().eq("id", data.id);
        if (error) {
          console.error("Supabase error deleting customer query:", error);
          return { ok: false as const };
        }
        return { ok: true as const };
      }

      setFallbackQueries(getFallbackQueries().filter((q) => q.id !== data.id));
      return { ok: true as const };
    } catch (error) {
      console.error("Error deleting query:", error);
      return { ok: false as const };
    }
  });
