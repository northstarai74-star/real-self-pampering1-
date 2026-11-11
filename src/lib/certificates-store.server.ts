// Server-only Airtable storage. Keep the token out of client code and responses.

export type CertificateFields = {
  number: string;
  holder: string;
  course: string;
  issued: string;
  level: string;
};

export type Certificate = CertificateFields & { id: string; expires?: string };

export type VerificationResult =
  | { status: "valid"; certificate: Certificate }
  | { status: "name_mismatch"; certificate: Certificate }
  | { status: "not_found" };

const AIRTABLE_API_URL = "https://api.airtable.com/v0";
const FIELD_NAMES = {
  number: "Certificate Number",
  holder: "Holder",
  course: "Course",
  issued: "Issued",
  level: "Level",
} as const;
const LEGACY_EXPIRES_FIELD = "Expires";

function getAirtableConfig() {
  const token = process.env["AIRTABLE_PERSONAL_ACCESS_TOKEN"]?.trim();
  const baseId = process.env["AIRTABLE_BASE_ID"]?.trim();
  const tableName = process.env["AIRTABLE_TABLE_NAME"]?.trim() || "Certificates";

  if (!token || !baseId) {
    throw new Error(
      "Airtable is not configured. Set AIRTABLE_PERSONAL_ACCESS_TOKEN and AIRTABLE_BASE_ID on the server.",
    );
  }

  return {
    token,
    tableUrl: `${AIRTABLE_API_URL}/${encodeURIComponent(baseId)}/${encodeURIComponent(tableName)}`,
  };
}

function asObject(value: unknown, description: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Airtable returned an invalid ${description}.`);
  }
  return value as Record<string, unknown>;
}

async function airtableRequest(path = "", init: RequestInit = {}): Promise<unknown> {
  const { token, tableUrl } = getAirtableConfig();
  const response = await fetch(`${tableUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const responseText = await response.text();
  let body: unknown;

  if (responseText) {
    try {
      body = JSON.parse(responseText) as unknown;
    } catch {
      if (response.ok) throw new Error("Airtable returned an invalid JSON response.");
    }
  }

  if (!response.ok) {
    const error =
      body && typeof body === "object" ? (body as Record<string, unknown>)["error"] : null;
    const errorMessage =
      typeof error === "string"
        ? error
        : error && typeof error === "object" && "message" in error
          ? String(error.message)
          : responseText;
    throw new Error(
      `Airtable request failed (${response.status}): ${errorMessage || response.statusText}`,
    );
  }

  if (body === undefined) throw new Error("Airtable returned an empty response.");
  return body;
}

function toCertificate(value: unknown): Certificate {
  const record = asObject(value, "record");
  if (typeof record["id"] !== "string")
    throw new Error("Airtable returned a record without an ID.");
  const fields = asObject(record["fields"], "record fields");

  const getField = (key: keyof typeof FIELD_NAMES): string => {
    const value = fields[FIELD_NAMES[key]];
    if (typeof value !== "string") {
      throw new Error(
        `Airtable record ${record["id"]} is missing the "${FIELD_NAMES[key]}" text field.`,
      );
    }
    return value;
  };

  const certificate: Certificate = {
    id: record["id"],
    number: getField("number"),
    holder: getField("holder"),
    course: getField("course"),
    issued: getField("issued"),
    level: getField("level"),
  };
  const expires = fields[LEGACY_EXPIRES_FIELD];
  if (typeof expires === "string") certificate.expires = expires;
  return certificate;
}

function toAirtableFields(certificate: CertificateFields) {
  return {
    [FIELD_NAMES.number]: certificate.number,
    [FIELD_NAMES.holder]: certificate.holder,
    [FIELD_NAMES.course]: certificate.course,
    [FIELD_NAMES.issued]: certificate.issued,
    [FIELD_NAMES.level]: certificate.level,
  };
}

export async function readCertificates(): Promise<Certificate[]> {
  const certificates: Certificate[] = [];
  let offset: string | undefined;

  do {
    const query = offset ? `?offset=${encodeURIComponent(offset)}` : "";
    const result = asObject(await airtableRequest(query), "list response");
    if (!Array.isArray(result["records"]))
      throw new Error("Airtable returned an invalid records list.");
    certificates.push(...result["records"].map(toCertificate));
    offset = typeof result["offset"] === "string" ? result["offset"] : undefined;
  } while (offset);

  return certificates;
}

export async function createCertificate(certificate: CertificateFields): Promise<Certificate> {
  const result = asObject(
    await airtableRequest("", {
      method: "POST",
      body: JSON.stringify({ records: [{ fields: toAirtableFields(certificate) }] }),
    }),
    "create response",
  );
  if (!Array.isArray(result["records"]) || result["records"].length !== 1) {
    throw new Error("Airtable did not return the newly created certificate.");
  }
  return toCertificate(result["records"][0]);
}

export async function updateCertificate(
  id: string,
  certificate: CertificateFields,
): Promise<Certificate> {
  const result = await airtableRequest(`/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ fields: toAirtableFields(certificate) }),
  });
  return toCertificate(result);
}

export async function deleteCertificate(id: string): Promise<void> {
  const result = asObject(
    await airtableRequest(`/${encodeURIComponent(id)}`, { method: "DELETE" }),
    "delete response",
  );
  if (result["deleted"] !== true)
    throw new Error("Airtable did not confirm the certificate deletion.");
}

const normalise = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, " ").replace(/[‐-―]/g, "-");

const normaliseNumber = (value: string) => normalise(value).replace(/[\s-]/g, "");

export function matchCertificate(
  list: Certificate[],
  numberInput: string,
  nameInput: string,
): VerificationResult {
  const wantedNumber = normaliseNumber(numberInput);
  const wantedName = normalise(nameInput);

  const match = list.find((certificate) => normaliseNumber(certificate.number) === wantedNumber);
  if (!match) return { status: "not_found" };
  if (normalise(match.holder) !== wantedName) {
    return { status: "name_mismatch", certificate: match };
  }
  return { status: "valid", certificate: match };
}
