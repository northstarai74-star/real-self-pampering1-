import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import g8 from "@/assets/gallery-8.jpg";
import g9 from "@/assets/gallery-9.jpg";

const posts = [
  { src: g4, alt: "Bridal nails with pearl and fine gold detailing" },
  { src: g3, alt: "Chrome mirror nails catching the light" },
  { src: g8, alt: "Lilac ombre gel extensions" },
  { src: g5, alt: "Hand-painted abstract nail art in plum and cream" },
  { src: g2, alt: "Soft white french tips on almond nails" },
  { src: g6, alt: "Terracotta seasonal nail design with botanical detail" },
  { src: g1, alt: "Bare nude manicure with a natural finish" },
  { src: g9, alt: "Studio polish palette and fine art brushes" },
];

export function SocialGrid() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-xs flex items-center gap-3 text-plum">
              <span className="h-px w-8 bg-gold" />
              {site.handle}
            </p>
            <h2 className="mt-6 text-4xl text-ink md:text-5xl">
              Follow the <span className="italic text-plum">Art</span>
            </h2>
          </div>
          <a
            href={site.socials[0]!.href}
            target="_blank"
            rel="noreferrer noopener"
            className="label-xs border-b border-ink/30 pb-1 text-ink transition-colors duration-300 hover:border-gold hover:text-plum"
          >
            Follow on Instagram
          </a>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {posts.map((post, i) => (
            <Reveal key={i} delay={(i % 4) * 70}>
              <a
                href={site.socials[0]!.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group block aspect-square overflow-hidden bg-muted"
              >
                <img
                  src={post.src}
                  alt={post.alt}
                  width={900}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
