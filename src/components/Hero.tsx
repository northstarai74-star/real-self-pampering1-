import heroImage from "@/assets/hero-nails.jpg";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden bg-cream">
      <img
        src={heroImage}
        alt="Close-up of hands with glossy nude-blush almond nails resting on cream silk"
        width={1920}
        height={1088}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 size-full object-cover object-[70%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-cream/85 via-cream/45 to-transparent" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-10 md:pb-24">
        <div className="max-w-xl">
          <p className="label-xs flex items-center gap-3 text-plum">
            <span className="h-px w-8 bg-gold" />
            {site.city} — {site.tagline}
          </p>
          <h1 className="mt-6 font-display text-[13vw] leading-[0.95] text-ink sm:text-6xl lg:text-[4.75rem]">
            Nail Art,
            <br />
            <span className="italic text-plum">Elevated.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink/75 md:text-lg">
            Thoughtfully designed nails for those who appreciate the details.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4 sm:gap-x-8 sm:gap-y-4">
            <a
              href="#verify"
              className="label-xs border border-plum bg-plum px-6 sm:px-8 py-3 sm:py-4 text-primary-foreground transition-colors duration-300 hover:bg-ink text-center sm:text-left"
            >
              Verify a Certificate
            </a>
            <a
              href="#gallery"
              className="label-xs border-b border-ink/30 pb-1 text-ink transition-colors duration-300 hover:border-gold hover:text-plum text-center sm:text-left"
            >
              Explore Our Work
            </a>
          </div>
        </div>
      </div>

      <span className="label-xs absolute bottom-8 right-5 hidden text-ink/50 md:block md:right-10">
        Est. 2019
      </span>
    </section>
  );
}
