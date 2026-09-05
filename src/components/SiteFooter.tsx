import { services, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-plum text-white/80">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-display text-2xl text-white">{site.name}</p>
            <p className="label-xs mt-2 text-gold">{site.tagline} — {site.city}</p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed">
              A small studio for considered nail artistry. Certificates issued here can be verified
              at any time using the number printed on them.
            </p>
            <a
              href="#verify"
              className="label-xs mt-8 inline-block border border-white/40 px-6 py-3 text-white transition-colors duration-300 hover:border-gold hover:text-gold"
            >
              Verify a Certificate
            </a>
          </div>

          <nav className="lg:col-span-2" aria-label="Footer">
            <p className="label-xs text-white/50">Explore</p>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                { label: "Home", href: "#top" },
                { label: "Verify", href: "#verify" },
                { label: "Services", href: "#services" },
                { label: "Gallery", href: "#gallery" },
                { label: "About", href: "#about" },
                { label: "Contact", href: "#contact" },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="label-xs text-white/50">Services</p>
            <ul className="mt-5 space-y-3 text-sm">
              {services.slice(0, 6).map((s) => (
                <li key={s.name}>{s.name}</li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="label-xs text-white/50">Studio</p>
            <address className="mt-5 space-y-1 text-sm not-italic">
              {site.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="mt-3 block hover:text-white">
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="block hover:text-white">
                {site.email}
              </a>
            </address>
            <div className="mt-6 flex gap-5">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="label-xs transition-colors hover:text-gold"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/15 pt-8 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>{site.handle}</p>
        </div>
      </div>
    </footer>
  );
}
