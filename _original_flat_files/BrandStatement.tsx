import { Reveal } from "@/components/Reveal";

export function BrandStatement() {
  return (
    <section id="about" className="py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <h2 className="text-[11vw] leading-[1.02] text-ink sm:text-5xl lg:text-[3.5rem]">
              Where beauty
              <br />
              becomes <span className="italic text-plum">art.</span>
            </h2>
          </Reveal>
          <Reveal delay={140} className="lg:col-span-4 lg:col-start-9 lg:pt-6">
            <p className="text-ink/75">
              Self Pampering is a small studio built around one idea: nails are a finishing detail
              worth designing properly. We work in short, unhurried appointments — reading the shape
              of your hands, the way you use them, and the palette you actually live in.
            </p>
            <p className="mt-6 text-ink/75">
              Preparation is the part nobody photographs and the part that decides everything. From
              there, the design is drawn by hand, one nail at a time.
            </p>
            <p className="label-xs mt-8 text-gold">Studio practice since 2019</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
