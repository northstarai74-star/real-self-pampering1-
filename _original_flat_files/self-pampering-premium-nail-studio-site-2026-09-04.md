# Self Pampering — Premium Nail Studio Site

One editorial, photography-led homepage for **Self Pampering**, with **certificate verification** as the main action. No booking, no login, nothing for sale.

## What the visitor gets

1. **Hero** — full-screen macro nail-art photography, "Nail Art, Elevated." with the supporting line, and one primary action: **Verify a Certificate** (plus a quiet "Explore Our Work" link).
2. **Certificate check** — the site's centrepiece, placed high on the page. Two fields: certificate number and holder name. Results:
   - Valid: an elegant card showing holder name, certificate number, course/training title, issue date, and a fine gold "Verified" mark.
   - Not found / name mismatch: a calm, non-alarming message explaining what to re-check.
   - Small note that checks are case-insensitive and spacing-tolerant.
3. **Brand statement** — "Where beauty becomes art." asymmetric layout, generous whitespace.
4. **What we offer** — editorial list with thin dividers (Manicure, Gel Manicure, Pedicure, Nail Art, Gel Extensions, Nail Extensions, Custom Nail Design), each with a short description and a "from" price. Informational only — no book buttons.
5. **The Art gallery** — masonry, mixed heights, category filters (All, Minimal, French, Chrome, Bridal, Creative, Seasonal), hover zoom with title overlay, lightbox on click.
6. **Signature Collection** — dramatic asymmetric image/text break.
7. **Why Choose Us** — 01–04 numbered typographic points, no icon cards.
8. **Testimonials** — minimal horizontal slider, 4 quotes with name, location, stars.
9. **Follow the Art** — 8-image social grid with @selfpampering handle.
10. **Contact** — address, phone, email, hours, map area, socials, plus a short inquiry form (name, email, phone, message → "Send Inquiry").
11. **Footer** — deep plum, spacious, logo, brand line, nav, services, contact, socials.

Sticky navigation: logo left, Home / Services / Gallery / Verify / About / Contact, **Verify Certificate** as the right-hand action; transparent over the hero, solid on scroll. Mobile gets a hamburger and a persistent verify button.

## Certificate data

The site has no database yet, so verification runs against a small built-in set of sample certificates (about 8 records) that I will label clearly as placeholders. You can hand me the real list any time and I'll swap it in; if you'd rather manage certificates yourself and add new ones without me, we can move the list into Lovable Cloud later — say the word.

## Placeholder content

Address, phone, email, hours, prices, testimonials and certificate records will be tasteful invented samples. Send me the real details and I'll replace them.

## Technical notes

- Playfair Display + Montserrat loaded via a `<link>` in `src/routes/__root.tsx`; families registered in `@theme` in `src/styles.css`.
- Palette added as semantic tokens in oklch: cream canvas, blush/lavender section washes, plum and charcoal text, gold used only for hairlines and the verified mark. No hardcoded colour classes in components.
- Single route `src/routes/index.tsx` (replaces the placeholder) composing section components under `src/components/`; certificate records and matching logic in `src/lib/certificates.ts` (normalised, case-insensitive comparison).
- Imagery generated as editorial macro nail photography into `src/assets`, sized per slot, lazy-loaded below the fold, hero eager with priority sizing.
- Motion: 200–500ms fade/slide-up scroll reveals via IntersectionObserver, image scale on hover, restrained lightbox transition. No parallax or bouncing.
- SEO: single H1, semantic sections, descriptive alt text, per-route `head()` with title/description/og/twitter and LocalBusiness JSON-LD.
- Mobile-first breakpoints with 2-column gallery, no horizontal overflow, touch-sized controls.
