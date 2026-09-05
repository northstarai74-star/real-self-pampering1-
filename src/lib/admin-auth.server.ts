// Server-only. Never import this from a client component — the *.server.ts
// suffix opts this module out of the client bundle (see AGENTS.md / eslint.config.js).

const DEFAULT_ADMIN_PASSWORD = "selfpampering-admin";

export function getAdminPassword(): string {
  return process.env["ADMIN_PASSWORD"]?.trim() || DEFAULT_ADMIN_PASSWORD;
}

export function isValidAdminPassword(candidate: string): boolean {
  return candidate.length > 0 && candidate === getAdminPassword();
}
