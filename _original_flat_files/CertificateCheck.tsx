import { useState } from "react";
import { z } from "zod";
import { BadgeCheck, Search, AlertCircle } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { verifyCertificate, type VerificationResult } from "@/lib/certificates";

const schema = z.object({
  number: z
    .string()
    .trim()
    .nonempty({ message: "Enter the certificate number." })
    .max(40, { message: "Certificate numbers are shorter than this." }),
  name: z
    .string()
    .trim()
    .nonempty({ message: "Enter the name printed on the certificate." })
    .max(80, { message: "Name must be under 80 characters." }),
});

export function CertificateCheck() {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ number?: string; name?: string }>({});
  const [result, setResult] = useState<VerificationResult | null>(null);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = schema.safeParse({ number, name });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setErrors({ number: flat.number?.[0], name: flat.name?.[0] });
      setResult(null);
      return;
    }
    setErrors({});
    setResult(verifyCertificate(parsed.data.number, parsed.data.name));
  };

  return (
    <section id="verify" className="relative border-y border-border bg-white/60 py-20 md:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 md:px-10 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
        <Reveal>
          <p className="label-xs flex items-center gap-3 text-plum">
            <span className="h-px w-8 bg-gold" />
            Certificate Register
          </p>
          <h2 className="mt-6 text-4xl text-ink md:text-5xl">
            Check a certificate
            <br />
            <span className="italic text-plum">is genuine.</span>
          </h2>
          <p className="mt-6 max-w-md text-ink/70">
            Every training certificate issued by our studio carries a unique number. Enter that
            number together with the name printed on the certificate and we will confirm whether the
            record exists in our register.
          </p>
          <p className="mt-6 max-w-md text-sm text-muted-foreground">
            Capitalisation, extra spaces and dashes do not matter. If the details do not match, check
            the number against the printed certificate before contacting the studio.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={onSubmit} noValidate className="border border-border bg-background p-6 md:p-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="cert-number" className="label-xs text-ink/70">
                  Certificate number
                </label>
                <input
                  id="cert-number"
                  name="cert-number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="SP-2025-0104"
                  maxLength={40}
                  aria-invalid={Boolean(errors.number)}
                  aria-describedby={errors.number ? "cert-number-error" : undefined}
                  className="mt-3 w-full border-b border-border bg-transparent pb-3 text-lg text-ink outline-none transition-colors placeholder:text-ink/25 focus:border-plum"
                />
                {errors.number && (
                  <p id="cert-number-error" className="mt-2 text-sm text-destructive">
                    {errors.number}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="cert-name" className="label-xs text-ink/70">
                  Name on certificate
                </label>
                <input
                  id="cert-name"
                  name="cert-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sofia Marchetti"
                  maxLength={80}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "cert-name-error" : undefined}
                  className="mt-3 w-full border-b border-border bg-transparent pb-3 text-lg text-ink outline-none transition-colors placeholder:text-ink/25 focus:border-plum"
                />
                {errors.name && (
                  <p id="cert-name-error" className="mt-2 text-sm text-destructive">
                    {errors.name}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="label-xs mt-8 inline-flex items-center gap-3 border border-plum bg-plum px-8 py-4 text-primary-foreground transition-colors duration-300 hover:bg-ink"
            >
              <Search className="size-3.5" strokeWidth={1.5} />
              Check Certificate
            </button>

            <div aria-live="polite" className="mt-8">
              {result?.status === "valid" && (
                <div className="border border-gold/50 bg-white p-6">
                  <p className="label-xs flex items-center gap-2 text-gold">
                    <BadgeCheck className="size-4" strokeWidth={1.5} />
                    Verified — record found
                  </p>
                  <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                    <Field label="Holder" value={result.certificate.holder} />
                    <Field label="Certificate number" value={result.certificate.number} />
                    <Field label="Training" value={result.certificate.course} />
                    <Field label="Level" value={result.certificate.level} />
                    <Field label="Issued" value={result.certificate.issued} />
                    <Field label="Valid until" value={result.certificate.expires} />
                  </dl>
                </div>
              )}

              {result?.status === "name_mismatch" && (
                <div className="border border-border bg-blush/30 p-6">
                  <p className="label-xs flex items-center gap-2 text-plum">
                    <AlertCircle className="size-4" strokeWidth={1.5} />
                    Number found, name does not match
                  </p>
                  <p className="mt-4 text-sm text-ink/75">
                    That certificate number exists in our register, but it is issued to a different
                    name. Please check the spelling of the name exactly as printed.
                  </p>
                </div>
              )}

              {result?.status === "not_found" && (
                <div className="border border-border bg-lavender/20 p-6">
                  <p className="label-xs flex items-center gap-2 text-plum">
                    <AlertCircle className="size-4" strokeWidth={1.5} />
                    No matching record
                  </p>
                  <p className="mt-4 text-sm text-ink/75">
                    We could not find this number in our register. Certificate numbers look like
                    SP-2025-0104. If the details are correct, contact the studio and we will look
                    into it.
                  </p>
                </div>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label-xs text-ink/50">{label}</dt>
      <dd className="mt-2 text-ink">{value}</dd>
    </div>
  );
}
