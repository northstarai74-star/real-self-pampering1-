import { Reveal } from "@/components/Reveal";
import { differentiators } from "@/lib/site";

export function WhyUs() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <p className="label-xs flex items-center gap-3 text-plum">
            <span className="h-px w-8 bg-gold" />
            The studio experience
          </p>
          <h2 className="mt-6 max-w-lg text-4xl text-ink md:text-5xl">
            Why clients stay <span className="italic text-plum">with us.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-x-16 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((item, i) => (
            <Reveal key={item.number} delay={i * 90} className="border-t border-border pt-6">
              <p className="font-display text-3xl text-gold">{item.number}</p>
              <h3 className="mt-4 text-2xl text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
