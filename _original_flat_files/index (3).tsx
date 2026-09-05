import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { SiteNav } from "@/components/SiteNav";
import { Hero } from "@/components/Hero";
import { CertificateCheck } from "@/components/CertificateCheck";
import { BrandStatement } from "@/components/BrandStatement";
import { Services } from "@/components/Services";
import { Gallery } from "@/components/Gallery";
import { Collection } from "@/components/Collection";
import { WhyUs } from "@/components/WhyUs";
import { Testimonials } from "@/components/Testimonials";
import { SocialGrid } from "@/components/SocialGrid";
import { Contact } from "@/components/Contact";
import { SiteFooter } from "@/components/SiteFooter";
import { site } from "@/lib/site";

const title = `Premium Nail Studio in ${site.city} | ${site.name}`;
const description =
  "Manicures, gel extensions and hand-painted nail art at Self Pampering, a nail atelier in Lisbon. Explore our work and verify a studio certificate.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NailSalon",
          name: site.name,
          description,
          telephone: site.phone,
          email: site.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: site.address[0],
            addressLocality: site.city,
            addressCountry: "PT",
          },
          openingHours: ["Tu-Fr 10:00-19:00", "Sa 10:00-17:00"],
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <CertificateCheck />
        <BrandStatement />
        <Services />
        <Gallery />
        <Collection />
        <WhyUs />
        <Testimonials />
        <SocialGrid />
        <Contact />
      </main>
      <SiteFooter />
      <Toaster />
    </>
  );
}
