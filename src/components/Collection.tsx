import collectionImage from "@/assets/collection.jpg";
import { Reveal } from "@/components/Reveal";

export function Collection() {
  return (
    <section className="bg-ink py-20 text-white md:py-28">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 md:px-10 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-6">
          <img
            src={collectionImage}
            alt="Hand with sculpted lavender chrome nail art against a warm cream backdrop"
            width={1024}
            height={1280}
            loading="lazy"
            decoding="async"
            className="w-full object-cover"
          />
        </Reveal>
        <Reveal delay={140} className="lg:col-span-5 lg:col-start-8">
          <p className="label-xs text-gold">The Signature Collection</p>
          <h2 className="mt-6 text-4xl md:text-5xl">
            Designed to be
            <br />
            <span className="italic">noticed.</span>
          </h2>
          <p className="mt-6 text-white/70">
            Six finishes developed in the studio over one season — iridescent lilacs, quiet chromes and
            a hand-drawn line that runs through every set. Built to read beautifully in daylight and
            hold their shape for weeks.
          </p>
          <a
            href="#gallery"
            className="label-xs mt-10 inline-block border-b border-white/40 pb-1 text-white transition-colors duration-300 hover:border-gold hover:text-gold"
          >
            Explore Collection
          </a>
        </Reveal>
      </div>
    </section>
  );
}
