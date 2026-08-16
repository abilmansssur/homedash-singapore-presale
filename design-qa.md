# HomeDash Singapore redesign QA

## Evidence

- Source visual truth: `C:\Users\user\Documents\HomeDash Singapore\design-reference-dmark\selected-option-1.png`
- Rendered implementation: `C:\Users\user\Documents\HomeDash Singapore\design-reference-dmark\implementation-desktop-final.png`
- Responsive implementation: `C:\Users\user\Documents\HomeDash Singapore\design-reference-dmark\implementation-mobile-final.png`
- Combined comparison: `C:\Users\user\Documents\HomeDash Singapore\design-reference-dmark\qa-side-by-side-final.png`
- Desktop viewport: 1440 × 1024 CSS px, device scale factor 1
- Source pixels: 1536 × 1024; normalized to 1440 × 960 on a 1440 × 1024 white comparison canvas
- Implementation pixels: 1440 × 1024
- Mobile viewport and pixels: 390 × 844, device scale factor 1
- State: public landing page, initial hero state, no modal or expanded FAQ

## Full-view comparison

The selected design and implementation now share the same primary hierarchy: floating white navigation, asymmetric property visual and oversized headline, orange conversion CTA, three-part rounded pilot metric strip, and immediate transition to a navy AI Listing Studio section. The implementation uses the supplied HomeDash logo and existing HomeDash Singapore hero artwork instead of the concept-only generated assets; this is an intentional brand-fidelity choice.

The user-provided pilot-package reference is implemented as a wider full-row metric pill rather than the smaller right-column pill in the concept. This is intentional because the attached package reference was an explicit requirement and remains visually consistent with the selected direction.

## Focused-region comparison

The hero and pilot strip were examined at full 1440px resolution in the combined comparison. A separate crop was not needed because the relevant typography, image crop, CTA, metric labels, radii and spacing are legible at that resolution. The mobile capture was inspected independently for sticky-navigation fit, headline wrapping, image crop and CTA visibility.

## Required fidelity surfaces

- Fonts and typography: Inter remains the established HomeDash primary font. Weight, scale and line-height reproduce the selected heavy editorial hierarchy; the small eyebrow and navigation retain readable optical weight.
- Spacing and layout rhythm: hero columns, rounded visual, floating navigation, CTA spacing and three-column metric strip align cleanly at desktop. Mobile stacks without horizontal overflow and keeps the primary CTA visible.
- Colors and tokens: bright orange conversion actions, white canvas, deep HomeDash navy and cyan micro-accents match the selected direction while preserving the brand palette.
- Image quality and asset fidelity: the supplied high-resolution HomeDash hero and logo are used directly. The final crop removes the old embedded headline and keeps the Singapore property, three outputs and social channel context in focus.
- Copy and content: the hero, metrics and pilot package use the approved HomeDash claims. `AutoPan` has been replaced everywhere by `Photo Motion Video`.

## Comparison history

### Iteration 1

- [P1] Hero headline wrapped into four lines because the highlighted phrase was forced to a block.
- [P2] Hero image crop exposed fragments of the old embedded headline.
- Fixes: made the highlighted phrase inline, reduced the display scale slightly and moved the source crop to the right edge.
- Post-fix evidence: `implementation-desktop-final.png` shows the intended three-line headline and a clean product-only crop.

### Iteration 2

- [P2] The AI Listing Studio appeared after proof sections instead of immediately after the hero package.
- Fix: moved the visual section order so the listing studio follows the metric strip, then tightened the transition spacing.
- Post-fix evidence: the navy listing-studio section now begins directly below the pilot strip in `implementation-desktop-final.png`.

## Primary interactions tested

- Navigation targets resolved successfully: `#tools`, `#pilot-package`, `#booking`, and `#faq`.
- Hero and header CTAs resolve to the booking section.
- Desktop and mobile layouts render successfully in the in-app browser.
- Browser/server check: page title and route loaded successfully; local preview requests returned 200 and no application errors were observed during the tested states.

## Findings

No actionable P0, P1 or P2 issues remain. The use of the supplied bilingual HomeDash logo and the full-width pilot metrics are intentional deviations from the generated concept.

## Follow-up polish

- [P3] A future brand pass could replace the concept’s generic HomeDash.ai lockup with an official Singapore-specific English lockup if one is supplied.

final result: passed
