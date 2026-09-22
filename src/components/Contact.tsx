import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export function Contact() {

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
          <Reveal className="lg:col-span-6">
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3415.3818777482693!2d76.11336277482607!3d31.12690777439647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391abdc6bda26a9d%3A0x77eb097cb9b2201e!2sBake%20House!5e0!3m2!1sen!2sin!4v1790065519764!5m2!1sen!2sin"
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
        </div>
      </div>
    </section>
  );
}
