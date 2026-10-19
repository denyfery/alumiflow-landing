# AlumiFlow — connected workshop preview

## Agreed scope

The redesign uses the scroll-world and ui-ux-pro-max skills. The user chose a fly-through camera, desktop-only cinematic scope with a responsive page, and an interactive preview without paid rendering. No external generation tools, subscriptions, or media jobs were started.

## Visual direction

- Preserve the AlumiFlow wordmark and navy/cyan identity.
- Use warm off-white surfaces, blue-green accents, architectural grids, and restrained borders.
- Use the existing Manrope / DM Sans fonts. The verified UI/UX search for “SaaS immersive storytelling” informed spacious layout, typographic hierarchy, scroll-driven movement, focus states, and reduced-motion handling; the existing brand takes priority over its generic palette suggestion.
- Introduce the workshop in the hero; explain fragmented work; follow one order through the world; then show connected features, team perspectives, guides, FAQs, and a demo request.
- Keep all product claims grounded in the previous page. The workshop, workers, and order are illustrations.

## Journey

1. Customer: needs and survey scheduling.
2. Survey: measurements, photos, and notes.
3. Workshop: quotation, approval, job, and material needs.
4. Installation: assignments, progress, issues, and evidence.
5. Payment: verified work, invoice, and payment.

`WorkshopWorld.tsx` defines a persistent SVG scene using shared isometric projection. `ScrollWorld.tsx` interpolates camera position across that same scene and pulls back between stops. This is a vector prototype of the camera journey, not the skill's final frame-locked AI video chain.

## Interaction and accessibility

- Native scrolling; no wheel/touch interception.
- Passive scroll listener, requestAnimationFrame updates, time-based interpolation, and complete effect cleanup.
- Semantic stage buttons with `aria-current`, labelled navigation, visible keyboard focus, and a final demo link.
- Reduced motion and short viewports use manual stage selection with a static scene.
- No-JavaScript visitors receive the five chapter descriptions.
- Indonesian and English routes retain their prerendered HTML, metadata, and guide links.
- The existing WhatsApp demo request flow and destination are retained.

## Future video production

Only proceed after the user explicitly chooses the render budget and billing account. Verify current CLI availability, authentication, provider schema, and pricing first. The five-scene architecture B journey would require five stills, five dives, and four connectors. Each connector must use the actual neighboring rendered boundary frames, followed by encoding and seam QA per the scroll-world skill. Mobile native 9:16 remains outside the selected scope. Do not describe the SVG preview as a rendered cinematic film.

## Verification

- `npm run build` passed: TypeScript, Vite production bundle, and six prerendered Indonesian/English home and guide routes.
- `git diff --check` passed.
- Browser layout checked at 320, 375, 768, 1024, and 1440px. A 320px scrollbar overflow was fixed and rechecked.
- Hero and journey visually checked on desktop and mobile. Navigation changes both chapter copy and camera destination, including returning to an earlier stage.
- A 1024 × 550 viewport correctly uses the static, manually selectable journey.
- Language switching, team perspective buttons, FAQ expansion, empty-form required validation, and internal anchor targets checked in-browser.
- No browser error/warning messages were recorded in the checked preview.
- No WhatsApp message was sent; the existing submit handler remains responsible for opening the composed request.
- The operating system reduced-motion preference was not changed during QA; its implementation shares the tested static journey path.

## Interactive hero follow-up

The hero now uses `HeroWorld.tsx` and `hero-world.css`. JavaScript animates the route dashes, an order marker following the actual SVG route, a delivery van, and selected workers through the Web Animations API. Fine-pointer movement adds a small, time-smoothed parallax; touch users select the same five numbered areas without parallax. The information card changes only after a selection. Native buttons support keyboard activation and expose pressed state.

The pause control preserves the current animation positions and resumes from them. IntersectionObserver and document visibility pause background work off-screen; reduced motion resets ambient animation and keeps the area controls usable. All animations and listeners are cleaned up on unmount.

Hero QA: all five area selections updated the matching information, Enter activated a stage, pointer interaction changed the scene transform, and paused route/van/marker computed transforms stayed identical across separate observations. Resuming changed the transforms again. Layouts at 320, 375, 768, 1024, and 1440px had no horizontal overflow; hotspot targets were at least 44px. Mobile information-card spacing was corrected and measured clear of the audience label. English controls and copy rendered correctly. No application warning/error messages were recorded in the checked page. OS reduced-motion and document-visibility changes were not separately simulated in-browser.
