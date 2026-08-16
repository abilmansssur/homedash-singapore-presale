# HomeDash Singapore exact-styling QA

## Evidence

- Source visual truth: `C:\Users\user\.codex\generated_images\019fc53f-955f-70f0-ac33-b66a386940f8\exec-12786351-84b8-450c-b0e6-bf60d9b0c233.png`
- Rendered implementation: `C:\Users\user\Documents\HomeDash Singapore\design-reference-dmark\implementation-exact-final.png`
- Responsive implementation: `C:\Users\user\Documents\HomeDash Singapore\design-reference-dmark\implementation-exact-mobile.png`
- Combined comparison: `C:\Users\user\Documents\HomeDash Singapore\design-reference-dmark\qa-exact-side-by-side.png`
- Desktop viewport and source: 1536 × 1024 CSS px, device scale factor 1
- Mobile viewport: 390 × 844 CSS px, device scale factor 1
- State: initial landing-page state, no modal or expanded FAQ

## Full-view comparison

The implementation matches the reference composition: an 82px white header, a 660px white hero with a 600 × 450 rounded visual on the left, a dense conversion block on the right, an inline three-part metric pill, a centered orange CTA, and an immediate transition into a 342px navy AI Listing Studio preview with three equal cards.

The supplied bilingual HomeDash logo and actual HomeDash product media replace the concept-only generic lockup and generated property imagery. Their placement, scale, crop, radii and surrounding whitespace follow the reference while preserving brand and product fidelity.

## Focused-region comparison

The hero-to-studio boundary was reviewed at native 1536 × 1024 resolution in the combined comparison. The final hero image occupies approximately y=109–559 versus y=110–560 in the source. The navy studio boundary begins at approximately y=654 versus y=660 in the source, a six-pixel difference with no hierarchy or rhythm impact. The mobile capture was reviewed separately for navigation wrapping, headline scale, media crop, metric stacking, CTA visibility and horizontal overflow.

## Required fidelity surfaces

- Fonts and typography: the established HomeDash primary font is retained; the large black/orange headline, compact navigation, metric hierarchy and white studio typography reproduce the reference's editorial contrast.
- Spacing and layout rhythm: header, hero columns, visual height, copy start, metric pill, CTA and studio-card geometry follow the source proportions. Responsive layouts stack cleanly.
- Colors and tokens: white canvas, HomeDash navy, bright orange action color, cyan accent and muted slate supporting copy match the reference palette.
- Image quality and asset fidelity: the supplied logo, HomeDash Singapore hero artwork and real property-tour imagery are used directly. Cropping avoids exposing the old embedded headline.
- Copy and content: approved pilot terms and the user-friendly `Photo Motion Video` name remain intact. Detailed workflow content continues below the exact opening composition.

## Comparison history

### Iteration 1

- [P1] The pilot metrics originally sat below the hero, pushing the studio too far down.
- [P2] The hero crop exposed part of the older embedded headline.
- [P2] The studio intro and cards were taller than the reference.
- Fixes: moved the metrics into the right hero column, scaled and right-aligned the real hero asset, added the immediate studio preview, and fixed its card-media slots to 170px.

### Iteration 2

- [P2] The navy studio boundary began about 16px below the reference.
- Fix: set the desktop hero to 660px and tightened the section boundary. The remaining difference is approximately six pixels.

## Primary interactions tested

- Production build and rendered-HTML test passed: 1 test, 0 failures.
- Navigation targets resolved and were visible in the in-app browser: `#tools`, `#workflows`, `#pilot-package`, `#booking`, and `#faq`.
- Desktop and mobile layouts rendered successfully in the in-app browser.
- Page title and route loaded successfully; no application errors were observed in the tested states.

## Findings

No actionable P0, P1 or P2 issues remain. The use of the supplied bilingual HomeDash logo and real product assets is an intentional fidelity improvement over the generated placeholders.

## Follow-up polish

- [P3] If an official Singapore-specific English-only HomeDash lockup is supplied later, it can replace the bilingual logo without changing the layout.

final result: passed
