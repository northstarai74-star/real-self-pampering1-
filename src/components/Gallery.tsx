import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import g7 from "@/assets/gallery-7.jpg";
import g8 from "@/assets/gallery-8.jpg";
import g9 from "@/assets/gallery-9.jpg";

type Work = {
  src: string;
  title: string;
  category: string;
  alt: string;
  w: number;
  h: number;
};

export const works: Work[] = [
  {
    src: g1,
    title: "Bare Study",
    category: "Minimal",
    alt: "Macro photograph of a bare nude manicure on squared nails against a cream background",
    w: 900,
    h: 1200,
  },
  {
    src: g2,
    title: "Porcelain French",
    category: "French",
    alt: "Long almond nails with a soft white french finish on a blush pink background",
    w: 900,
    h: 900,
  },
  {
    src: g3,
    title: "Liquid Mirror",
    category: "Chrome",
    alt: "Mirror chrome nails with a reflective silver finish on a lavender background",
    w: 900,
    h: 1300,
  },
  {
    src: g4,
    title: "Pearl Vow",
    category: "Bridal",
    alt: "Ivory bridal nails with pearl details and fine gold line work on cream silk",
    w: 900,
    h: 1100,
  },
  {
    src: g5,
    title: "Brushwork No. 4",
    category: "Creative",
    alt: "Hand-painted abstract nail art in plum, blush and cream brush strokes",
    w: 900,
    h: 900,
  },
  {
    src: g6,
    title: "Late Autumn",
    category: "Seasonal",
    alt: "Terracotta seasonal nail design with fine botanical detail on almond nails",
    w: 900,
    h: 1250,
  },
  {
    src: g7,
    title: "The Studio",
    category: "Minimal",
    alt: "Minimal nail studio interior with a marble table and a single vase in daylight",
    w: 1200,
    h: 900,
  },
  {
    src: g8,
    title: "Lilac Extension",
    category: "Creative",
    alt: "Long gel extensions with a glossy lilac ombre finish on a cream background",
    w: 900,
    h: 1150,
  },
  {
    src: g9,
    title: "The Palette",
    category: "Seasonal",
    alt: "Nail polish bottles in blush, cream and plum shades with fine art brushes on stone",
    w: 900,
    h: 1000,
  },
];

const categories = ["All", "Minimal", "French", "Chrome", "Bridal", "Creative", "Seasonal"];

export function Gallery() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<Work | null>(null);

  const visible = active === "All" ? works : works.filter((w) => w.category === active);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <section id="gallery" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-xs flex items-center gap-3 text-plum">
              <span className="h-px w-8 bg-gold" />
              Portfolio
            </p>
            <h2 className="mt-6 text-5xl text-ink md:text-6xl">
              The <span className="italic text-plum">Art</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={cn(
                  "label-xs pb-1 transition-colors duration-300",
                  active === c
                    ? "border-b border-gold text-plum"
                    : "border-b border-transparent text-ink/50 hover:text-ink",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-14 grid gap-4 grid-cols-1 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((work, i) => (
            <Reveal key={work.title} delay={(i % 4) * 80} className="overflow-hidden block">
              <button
                type="button"
                onClick={() => setLightbox(work)}
                className="group relative block w-full overflow-hidden bg-muted text-left"
                style={{ aspectRatio: `${work.w} / ${work.h}` }}
              >
                <img
                  src={work.src}
                  alt={work.alt}
                  width={work.w}
                  height={work.h}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 bg-plum/0 transition-colors duration-500 group-hover:bg-plum/25" />
                <span className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="label-xs block text-white/80">{work.category}</span>
                  <span className="mt-1 block font-display text-lg text-white">{work.title}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-4 duration-300 animate-in fade-in md:p-10"
        >
          <button
            type="button"
            aria-label="Close image"
            onClick={() => setLightbox(null)}
            className="absolute right-5 top-5 p-2 text-white/80 transition-colors hover:text-white md:right-10 md:top-10"
          >
            <X className="size-6" strokeWidth={1.25} />
          </button>
          <figure
            onClick={(e) => e.stopPropagation()}
            className="max-h-full duration-300 animate-in zoom-in-95"
          >
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              width={lightbox.w}
              height={lightbox.h}
              className="max-h-[78svh] w-auto object-contain"
            />
            <figcaption className="mt-4 flex items-baseline justify-between gap-4 text-white">
              <span className="font-display text-xl">{lightbox.title}</span>
              <span className="label-xs text-white/60">{lightbox.category}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
