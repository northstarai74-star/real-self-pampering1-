import { createServerFn } from "@tanstack/react-start";
import { getAdminPassword } from "./admin-auth.server";
import { supabase, type CustomerQuery } from "./supabase.server";

// In-memory fallback storage
const queriesStore: Map<string, CustomerQuery[]> = new Map();
queriesStore.set("queries", []);

function getFallbackQueries(): CustomerQuery[] {
  return queriesStore.get("queries") || [];
}

function setFallbackQueries(queries: CustomerQuery[]) {
  queriesStore.set("queries", queries);
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
      const cleanData = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || null,
        message: data.message.trim(),
      };

      if (supabase) {
        // Use Supabase
        const { error } = await supabase
          .from("customer_queries")
          .insert([cleanData]);

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        console.log("Query saved to Supabase:", cleanData);
        return { ok: true };
      } else {
        // Fallback to in-memory storage
        const queries = getFallbackQueries();
        const newQuery: CustomerQuery = {
          id: Date.now().toString(),
          ...cleanData,
          created_at: new Date().toISOString(),
        };
        queries.push(newQuery);
        setFallbackQueries(queries);
        console.log("Query saved to fallback storage:", newQuery);
        return { ok: true };
      }
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
      if (supabase) {
        // Fetch from Supabase
        const { data, error } = await supabase
          .from("customer_queries")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error:", error);
          return getFallbackQueries();
        }

        return data || [];
      } else {
        // Use fallback storage
        return getFallbackQueries();
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
      return getFallbackQueries();
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
      if (supabase) {
        // Delete from Supabase
        const { error } = await supabase
          .from("customer_queries")
          .delete()
          .eq("id", data.id);

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        return { ok: true };
      } else {
        // Delete from fallback storage
        const queries = getFallbackQueries();
        const filtered = queries.filter((q) => q.id !== data.id);
        setFallbackQueries(filtered);
        return { ok: true };
      }
    } catch (error) {
      console.error("Error deleting query:", error);
      return { ok: false };
    }
  });
