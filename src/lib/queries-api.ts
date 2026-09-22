import { createServerFn } from "@tanstack/react-start";
import { getAdminPassword } from "./admin-auth.server";

interface CustomerQuery {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  date: string;
}

// In-memory storage for development/demo
const queriesStore: Map<string, CustomerQuery[]> = new Map();
queriesStore.set("queries", []);

function getQueries(): CustomerQuery[] {
  return queriesStore.get("queries") || [];
}

function setQueries(queries: CustomerQuery[]) {
  queriesStore.set("queries", queries);

  // Also try to persist to file system if available
  try {
    if (typeof require !== "undefined") {
      const fs = require("fs");
      const path = require("path");
      const dataDir = path.join(process.cwd(), ".data");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const filePath = path.join(dataDir, "queries.json");
      fs.writeFileSync(filePath, JSON.stringify(queries, null, 2));
    }
  } catch (error) {
    console.warn("Could not persist queries to file:", error);
    // Continue with in-memory storage
  }
}

// Try to load from file system if available
function loadPersistedQueries() {
  try {
    if (typeof require !== "undefined") {
      const fs = require("fs");
      const path = require("path");
      const filePath = path.join(process.cwd(), ".data", "queries.json");
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf-8");
        const queries = JSON.parse(data);
        queriesStore.set("queries", queries);
      }
    }
  } catch (error) {
    console.warn("Could not load persisted queries:", error);
  }
}

// Load on startup
loadPersistedQueries();

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
      const queries = getQueries();
      const newQuery: CustomerQuery = {
        id: Date.now().toString(),
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || undefined,
        message: data.message.trim(),
        date: new Date().toISOString(),
      };
      queries.push(newQuery);
      setQueries(queries);
      console.log("Query saved:", newQuery);
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
      return getQueries();
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
      const queries = getQueries();
      const filtered = queries.filter((q) => q.id !== data.id);
      setQueries(filtered);
      return { ok: true };
    } catch (error) {
      console.error("Error deleting query:", error);
      return { ok: false };
    }
  });
