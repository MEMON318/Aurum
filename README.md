# AURUM Coffee House — Premium Website Concept

A responsive, multi-page café website with a dark editorial aesthetic, warm gold accents, premium typography, interactive menu search and filters, a demo tasting cart, and an enquiry form that prepares an email draft.

## Pages
- `index.html` — landing page, featured drinks, brand story and CTA
- `menu.html` — drink menu, search, category filters, demo cart and order email draft
- `about.html` — brand story and values
- `contact.html` — sample visit details and enquiry form
- `style.css` — design system, responsive layouts, motion preferences and focus states
- `script.js` — navigation, menu/cart behaviour, date validation and email-draft handling

## Run locally
1. Extract the ZIP.
2. Open `Aurum_Coffee_House/index.html` in a modern browser. No build step is required.
3. Internet is needed for Google Fonts and remote Unsplash photography. The site structure and core interactions work locally without a framework.

## Before a real launch
- Replace the sample address, opening hours, email, and phone number.
- Confirm all drink names, prices, availability, allergens and product images.
- `hello@yourcafe.com` is a placeholder used for email drafts; replace it in `script.js` with a monitored business email.
- The menu cart and contact form are front-end demonstrations. The cart opens a prefilled email draft; it does not submit an order, process payment, reserve a table, or send a message automatically. For real orders, payments, bookings, or messages, integrate a secure backend and an appropriate provider.
- Add your own logo/brand assets, privacy notice, analytics consent (if applicable), and real social links.
- Test on current mobile and desktop browsers before publishing.

## Design notes
- Mobile-first responsive navigation and layouts
- Semantic landmarks, skip link, visible keyboard focus, form labels and status announcements
- Reduced-motion support
- CSS variables make the palette and spacing easy to customise
