import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

const schema = z.object({
  name: z.string().trim().nonempty({ message: "Please enter your name." }).max(100),
  email: z.string().trim().email({ message: "Please enter a valid email address." }).max(255),
  phone: z.string().trim().max(40).optional(),
  message: z
    .string()
    .trim()
    .nonempty({ message: "Please add a short message." })
    .max(1000, { message: "Message must be under 1000 characters." }),
});

type Errors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

export function Contact() {
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setErrors({
        name: flat.name?.[0],
        email: flat.email?.[0],
        phone: flat.phone?.[0],
        message: flat.message?.[0],
      });
      return;
    }
    setErrors({});
    setValues({ name: "", email: "", phone: "", message: "" });
    toast.success("Thank you — your inquiry has been noted.", {
      description: "This form is not yet connected to the studio inbox.",
    });
  };

  return (
    <section id="contact" className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <p className="label-xs flex items-center gap-3 text-plum">
            <span className="h-px w-8 bg-gold" />
            Visit the studio
          </p>
          <h2 className="mt-6 max-w-xl text-4xl text-ink md:text-5xl">
            Come and see the <span className="italic text-plum">work.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <dt className="label-xs text-ink/50">Address</dt>
                <dd className="mt-3 text-ink/80">
                  {site.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="label-xs text-ink/50">Contact</dt>
                <dd className="mt-3 text-ink/80">
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="block hover:text-plum">
                    {site.phone}
                  </a>
                  <a href={`mailto:${site.email}`} className="block hover:text-plum">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label-xs text-ink/50">Opening hours</dt>
                <dd className="mt-3 space-y-1 text-ink/80">
                  {site.hours.map((h) => (
                    <span key={h.days} className="flex justify-between gap-6 border-b border-border pb-1">
                      <span>{h.days}</span>
                      <span className="text-ink/60">{h.time}</span>
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="label-xs text-ink/50">Social</dt>
                <dd className="mt-3 flex gap-5">
                  {site.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="label-xs text-ink/70 hover:text-plum"
                    >
                      {s.label}
                    </a>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="mt-10 border border-border">
              <iframe
                title={`Map showing ${site.name}`}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3415.3818777482693!2d76.11336277482613!3d31.12690777439647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391abdc6bda26a9d%3A0x77eb097cb9b2201e!2sBake%20House!5e0!3m2!1sen!2sin!4v1789118549652!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full"
              />
            </div>
          </Reveal>

          <Reveal delay={140} className="lg:col-span-6 lg:col-start-7">
            <form onSubmit={onSubmit} noValidate className="grid gap-7">
              <Field
                id="contact-name"
                label="Name"
                value={values.name}
                onChange={set("name")}
                error={errors.name}
              />
              <Field
                id="contact-email"
                label="Email"
                type="email"
                value={values.email}
                onChange={set("email")}
                error={errors.email}
              />
              <Field
                id="contact-phone"
                label="Phone (optional)"
                type="tel"
                value={values.phone}
                onChange={set("phone")}
                error={errors.phone}
              />
              <div>
                <label htmlFor="contact-message" className="label-xs text-ink/70">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  maxLength={1000}
                  value={values.message}
                  onChange={set("message")}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                  className="mt-3 w-full resize-none border-b border-border bg-transparent pb-3 text-ink outline-none transition-colors focus:border-plum"
                />
                {errors.message && (
                  <p id="contact-message-error" className="mt-2 text-sm text-destructive">
                    {errors.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="label-xs justify-self-start border border-plum bg-plum px-8 py-4 text-primary-foreground transition-colors duration-300 hover:bg-ink"
              >
                Send Inquiry
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="label-xs text-ink/70">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        maxLength={255}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-3 w-full border-b border-border bg-transparent pb-3 text-ink outline-none transition-colors focus:border-plum"
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
