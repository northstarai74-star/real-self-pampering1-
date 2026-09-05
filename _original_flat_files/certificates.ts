export type Certificate = {
  number: string;
  holder: string;
  course: string;
  issued: string;
  expires: string;
  level: string;
};

/**
 * PLACEHOLDER RECORDS — replace with the studio's real certificate register.
 */
export const certificates: Certificate[] = [
  {
    number: "SP-2024-0118",
    holder: "Amara Lindqvist",
    course: "Gel Manicure & Nail Preparation",
    issued: "18 March 2024",
    expires: "18 March 2027",
    level: "Foundation",
  },
  {
    number: "SP-2024-0247",
    holder: "Noor Haddad",
    course: "Structured Gel Extensions",
    issued: "02 June 2024",
    expires: "02 June 2027",
    level: "Advanced",
  },
  {
    number: "SP-2024-0316",
    holder: "Elin Vasquez",
    course: "Editorial Nail Art & Hand Painting",
    issued: "27 August 2024",
    expires: "27 August 2027",
    level: "Advanced",
  },
  {
    number: "SP-2025-0032",
    holder: "Priya Raghavan",
    course: "Russian Manicure & Cuticle Care",
    issued: "14 January 2025",
    expires: "14 January 2028",
    level: "Specialist",
  },
  {
    number: "SP-2025-0104",
    holder: "Sofia Marchetti",
    course: "Chrome, Cat-Eye & Reflective Finishes",
    issued: "09 April 2025",
    expires: "09 April 2028",
    level: "Specialist",
  },
  {
    number: "SP-2025-0189",
    holder: "Jade Okonkwo",
    course: "Bridal Nail Design",
    issued: "21 May 2025",
    expires: "21 May 2028",
    level: "Advanced",
  },
  {
    number: "SP-2025-0233",
    holder: "Camille Rousseau",
    course: "Pedicure & Foot Care Protocols",
    issued: "07 July 2025",
    expires: "07 July 2028",
    level: "Foundation",
  },
  {
    number: "SP-2026-0011",
    holder: "Mei Tanaka",
    course: "Master Trainer — Nail Artistry",
    issued: "12 February 2026",
    expires: "12 February 2029",
    level: "Master",
  },
];

const normalise = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, " ").replace(/[\u2010-\u2015]/g, "-");

const normaliseNumber = (value: string) => normalise(value).replace(/[\s-]/g, "");

export type VerificationResult =
  | { status: "valid"; certificate: Certificate }
  | { status: "name_mismatch"; certificate: Certificate }
  | { status: "not_found" };

export function verifyCertificate(numberInput: string, nameInput: string): VerificationResult {
  const wantedNumber = normaliseNumber(numberInput);
  const wantedName = normalise(nameInput);

  const match = certificates.find((c) => normaliseNumber(c.number) === wantedNumber);
  if (!match) return { status: "not_found" };
  if (normalise(match.holder) !== wantedName) {
    return { status: "name_mismatch", certificate: match };
  }
  return { status: "valid", certificate: match };
}
