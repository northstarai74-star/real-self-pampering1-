import { useEffect, useState } from "react";
import { BadgeCheck, Clock, Images, MessageSquareQuote, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminListCertificates } from "@/lib/certificates-api";
import { differentiators, services, site, testimonials } from "@/lib/site";
import { works } from "@/components/Gallery";

const EXPIRING_WITHIN_DAYS = 90;

export function AdminOverview({
  password,
  onManageCertificates,
  onUnauthorized,
}: {
  password: string;
  onManageCertificates: () => void;
  onUnauthorized: () => void;
}) {
  const [totalCertificates, setTotalCertificates] = useState<number | null>(null);
  const [expiringSoon, setExpiringSoon] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminListCertificates({ data: { password } })
      .then((list) => {
        if (cancelled) return;
        setTotalCertificates(list.length);
        const now = Date.now();
        const horizon = now + EXPIRING_WITHIN_DAYS * 24 * 60 * 60 * 1000;
        setExpiringSoon(
          list.filter((c) => {
            const t = new Date(c.expires).getTime();
            return !Number.isNaN(t) && t >= now && t <= horizon;
          }).length,
        );
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : String(error);
        if (message.toLowerCase().includes("password")) onUnauthorized();
      });
    return () => {
      cancelled = true;
    };
  }, [password, onUnauthorized]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-10 duration-500">
      <div>
        <h2 className="text-xl text-ink">Studio at a glance</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A quick snapshot of what's live on the website right now.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard
            index={0}
            icon={<BadgeCheck className="size-5" strokeWidth={1.5} />}
            label="Certificates on file"
            value={totalCertificates}
            action={{ label: "Manage", onClick: onManageCertificates }}
          />
          <StatCard
            index={1}
            icon={<Clock className="size-5" strokeWidth={1.5} />}
            label="Expiring within 90 days"
            value={expiringSoon}
            tone={expiringSoon && expiringSoon > 0 ? "warning" : "default"}
            action={{ label: "Review", onClick: onManageCertificates }}
          />
          <StatCard
            index={2}
            icon={<Sparkles className="size-5" strokeWidth={1.5} />}
            label="Services listed"
            value={services.length}
          />
          <StatCard
            index={3}
            icon={<Images className="size-5" strokeWidth={1.5} />}
            label="Gallery pieces"
            value={works.length}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section
          className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both border border-border bg-background p-6 duration-500 transition-shadow hover:shadow-sm"
          style={{ animationDelay: "160ms" }}
        >
          <p className="label-xs text-plum">Studio details</p>
          <h3 className="mt-2 text-lg text-ink">Shown across the site</h3>
          <dl className="mt-5 space-y-4 text-sm">
            <Row label="Name / Tagline" value={`${site.name} — ${site.tagline}`} />
            <Row label="City" value={site.city} />
            <Row label="Address" value={site.address.join(", ")} />
            <Row label="Phone" value={site.phone} />
            <Row label="Email" value={site.email} />
            <Row
              label="Hours"
              value={site.hours.map((h) => `${h.days}: ${h.time}`).join(" · ")}
            />
          </dl>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            These come from <code className="rounded bg-muted px-1 py-0.5">src/lib/site.ts</code>{" "}
            — editing that file updates the nav, footer and contact section together.
          </p>
        </section>

        <section
          className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both border border-border bg-background p-6 duration-500 transition-shadow hover:shadow-sm"
          style={{ animationDelay: "220ms" }}
        >
          <p className="label-xs text-plum">Content on the page</p>
          <h3 className="mt-2 text-lg text-ink">Sections &amp; counts</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-center justify-between border-b border-border pb-3 transition-colors hover:bg-muted/40">
              <span className="flex items-center gap-2 text-ink/80">
                <Sparkles className="size-4 text-gold" strokeWidth={1.5} /> Services
              </span>
              <span className="text-ink">{services.length}</span>
            </li>
            <li className="flex items-center justify-between border-b border-border pb-3 transition-colors hover:bg-muted/40">
              <span className="flex items-center gap-2 text-ink/80">
                <Images className="size-4 text-gold" strokeWidth={1.5} /> Gallery images
              </span>
              <span className="text-ink">{works.length}</span>
            </li>
            <li className="flex items-center justify-between border-b border-border pb-3 transition-colors hover:bg-muted/40">
              <span className="flex items-center gap-2 text-ink/80">
                <MessageSquareQuote className="size-4 text-gold" strokeWidth={1.5} /> Testimonials
              </span>
              <span className="text-ink">{testimonials.length}</span>
            </li>
            <li className="flex items-center justify-between pb-1 transition-colors hover:bg-muted/40">
              <span className="flex items-center gap-2 text-ink/80">
                <BadgeCheck className="size-4 text-gold" strokeWidth={1.5} /> Why-us points
              </span>
              <span className="text-ink">{differentiators.length}</span>
            </li>
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            Editing these currently needs a developer — only the certificate register below is
            editable from this dashboard.
          </p>
        </section>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border pb-3 last:border-0 last:pb-0 sm:flex-row sm:justify-between sm:gap-6">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-ink sm:text-right">{value}</dd>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone = "default",
  action,
  index = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  tone?: "default" | "warning";
  action?: { label: string; onClick: () => void };
  index?: number;
}) {
  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both group border border-border bg-background p-4 duration-500 transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div
        className={
          tone === "warning" ? "flex items-center gap-2 text-amber-600" : "flex items-center gap-2 text-plum"
        }
      >
        <span className="transition-transform duration-300 group-hover:scale-110">{icon}</span>
        <span className="label-xs">{label}</span>
      </div>
      <p key={value ?? "pending"} className="mt-4 animate-in fade-in font-display text-3xl text-ink duration-300">
        {value ?? "—"}
      </p>
      {action && (
        <Button
          variant="link"
          size="sm"
          className="mt-1 h-auto px-0 text-plum transition-[gap] duration-200"
          onClick={action.onClick}
        >
          {action.label} →
        </Button>
      )}
    </div>
  );
}
