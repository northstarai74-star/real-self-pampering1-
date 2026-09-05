import { Reveal } from "@/components/Reveal";
import { services } from "@/lib/site";

export function Services() {
  return (
    <section id="services" className="bg-blush/25 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-xs flex items-center gap-3 text-plum">
              <span className="h-px w-8 bg-gold" />
              What we offer
            </p>
            <h2 className="mt-6 text-4xl text-ink md:text-5xl">Our Services</h2>
          </div>
          <p className="max-w-sm text-sm text-ink/65">
            Prices are starting points — final pricing depends on length, structure and the detail of
            the design. Every appointment includes preparation and aftercare guidance.
          </p>
        </Reveal>

        <ul className="mt-14 border-t border-border">
          {services.map((service, i) => (
            <Reveal as="li" key={service.name} delay={i * 60} className="border-b border-border">
              <div className="group grid gap-2 py-7 md:grid-cols-12 md:items-baseline md:gap-6">
                <h3 className="label-xs text-ink transition-colors duration-300 group-hover:text-plum md:col-span-3 md:text-xs">
                  {service.name}
                </h3>
                <p className="text-ink/70 md:col-span-6">{service.description}</p>
                <p className="label-xs text-ink/45 md:col-span-2">{service.duration}</p>
                <p className="font-display text-xl text-plum md:col-span-1 md:text-right">
                  {service.price}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
