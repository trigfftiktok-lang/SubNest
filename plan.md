# SubNest — Implementation & Design Plan

## Scope

`sub4unlock.io`-এর মূল product pattern অনুসরণ করে একটি one-page social unlocker website তৈরি করা হবে: visitor একটি destination URL দেবে, প্রয়োজনীয় social actions বেছে নেবে, এবং demo flow-তে একটি unlock link preview পাবে। ব্র্যান্ড নাম হবে **SubNest** এবং ব্যবহারকারীর দেওয়া orange–coral logo ব্যবহার করা হবে।

## Design direction

- **Design movement:** Warm neo-SaaS — reference-এর bold landing-page structure, কিন্তু SubNest-এর জন্য একটি sunset gradient ও soft editorial card system।
- **Core principles:** দ্রুত বোঝা যায়, এক নজরে CTA, creator-friendly microcopy, action-oriented controls।
- **Color philosophy:** deep ink-purple trust ও contrast তৈরি করবে; tangerine/orange energy ও conversion signal; coral/pink highlight brand-কে friendly রাখবে।
- **Layout paradigm:** asymmetrical hero with a right-side unlock preview, এরপর centered builder card, তারপর proof/feature blocks; generic centered grid নয়।
- **Signature elements:** orange gradient pill CTA, phone-like unlock preview, dotted “nest” pattern এবং rounded action chips।
- **Interaction philosophy:** সব গুরুত্বপূর্ণ action তাৎক্ষণিক feedback দেবে—selected chip, inline validation, toast, generated link state।
- **Animation:** page load-এ staggered rise, hero blobs-এর slow drift, button hover-এ lift, generated card-এ subtle success pulse; motion কম হলে reduced-motion respect করবে।
- **Typography:** `DM Sans` body-এর জন্য, `Space Grotesk` display headline-এর জন্য; বড় bold heading এবং compact helper text।
- **Brand essence:** creators-দের জন্য social actions-এর বিনিময়ে content unlock করার সহজ, transparent toolkit — উষ্ণ, স্মার্ট, নির্ভরযোগ্য। Personality: optimistic, practical, energetic।
- **Brand voice:** “Turn one click into a community.” / “Pick the actions. Share the unlock.”
- **Wordmark & logo:** user-supplied four-part orange mark, পাশে `SubNest` wordmark; app icon-এ rounded orange mark।
- **Signature brand color:** `#FF7417` tangerine orange।

## Implementation

- Vite + vanilla JavaScript, CSS custom properties, no backend required for the first demo.
- `src/main.js` handles nav, chip selection, form validation, generated link state, FAQ accordion, toast, and mobile menu.
- `src/styles.css` owns responsive layout, visual system, animation and accessibility states.
- `public/subnest-logo.jfif` uses the supplied logo; `public/manus-routes.json` declares `/`.
- `app.config.ts` stores durable platform logo metadata after upload.
- Development listens on port 3000 with Vite; build output is `dist/`.

## Project structure

- `index.html` — semantic page shell, SEO metadata, navigation, sections and footer.
- `src/main.js` — product interactions and view state.
- `src/styles.css` — visual language and responsive behavior.
- `public/subnest-logo.jfif` — supplied brand mark.
- `public/manus-routes.json` — route manifest.
- `package.json` — Vite scripts and pinned dependency.
- `app.config.ts` — project logo metadata.
