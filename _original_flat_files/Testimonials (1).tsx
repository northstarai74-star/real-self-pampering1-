import { useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { testimonials } from "@/lib/site";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const count = testimonials.length;
  const go = (dir: number) => setIndex((i) => (i + dir + count) % count);
  const current = testimonials[index]!;

  return (
    <section className="border-y border-border bg-lavender/20 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-xs flex items-center gap-3 text-plum">
              <span className="h-px w-8 bg-gold" />
              Testimonials
            </p>
            <h2 className="mt-6 text-4xl text-ink md:text-5xl">Loved by Our Clients</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="border border-border p-3 text-ink transition-colors duration-300 hover:border-plum hover:text-plum"
            >
              <ArrowLeft className="size-4" strokeWidth={1.25} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="border border-border p-3 text-ink transition-colors duration-300 hover:border-plum hover:text-plum"
            >
              <ArrowRight className="size-4" strokeWidth={1.25} />
            </button>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-14 max-w-3xl">
          <div aria-live="polite">
            <div className="flex gap-1" aria-label={`${current.rating} out of 5 stars`}>
              {Array.from({ length: current.rating }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-gold text-gold" strokeWidth={0} />
              ))}
            </div>
            <blockquote className="mt-6 text-2xl leading-snug text-ink md:text-3xl">
              {current.quote}
            </blockquote>
            <p className="label-xs mt-8 text-ink/60">
              {current.name} — {current.location}
            </p>
          </div>
          <div className="mt-10 flex gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show testimonial from ${t.name}`}
                className={`h-px w-10 transition-colors duration-300 ${
                  i === index ? "bg-plum" : "bg-ink/20 hover:bg-ink/40"
                }`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
