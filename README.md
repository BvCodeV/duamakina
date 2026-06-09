# Dua Makina

Dua Makina is a static car rental website for Albania. It includes a homepage search flow, fleet listing, vehicle detail pages, booking inquiry UI, currency conversion, reusable header/footer partials, and legal information pages.

## Current Status

This project is currently in demo/testing mode. Bookings are not real, inquiry submissions do not reserve vehicles, and the website does not currently create rental agreements or payment obligations.

Before production use, the legal pages, booking process, data retention rules, Supabase security policies, and email/captcha handling should be reviewed.

## Tech Stack

- HTML, CSS, and vanilla JavaScript
- Supabase for vehicle data, pricing, storage, and currency rates
- EmailJS for client-side inquiry email delivery
- hCaptcha for spam protection
- Flatpickr for date picking
- Vercel for hosting, headers, analytics, and clean URLs
- jsDelivr for third-party browser assets

## Project Structure

```text
.
├── index.html
├── pages/
│   ├── booking.html
│   ├── car.html
│   ├── faqs.html
│   ├── fleet.html
│   ├── privacy-policy.html
│   └── terms-and-conditions.html
├── sq/
│   ├── index.html
│   └── pages/
├── assets/
│   ├── components/
│   └── icons/
├── scripts/
│   ├── shared/
│   ├── booking.js
│   ├── calendar.js
│   ├── car.js
│   ├── currency.js
│   ├── database.js
│   ├── email.js
│   ├── filterbar.js
│   ├── fleet.js
│   └── index.js
├── styles/
├── robots.txt
├── sitemap.xml
└── vercel.json
```

## Main Routes

- `/` - homepage search and marketing content
- `/pages/fleet.html` - vehicle listing and filters
- `/pages/car.html?id=<car-id>` - vehicle details
- `/pages/booking.html?id=<car-id>` - booking inquiry flow
- `/pages/faqs.html` - frequently asked questions
- `/pages/privacy-policy.html` - privacy policy template
- `/pages/terms-and-conditions.html` - terms template
- `/sq/` and `/sq/pages/*` - Albanian route variants

## Main Scripts

- `scripts/components.js` loads header, navigation, and footer partials.
- `scripts/database.js` creates the Supabase client.
- `scripts/index.js` controls shared homepage/dropoff behavior and day calculation.
- `scripts/filterbar.js` validates the homepage search and stores search state.
- `scripts/fleet.js` fetches and filters available cars.
- `scripts/car.js` renders vehicle detail data.
- `scripts/booking.js` renders booking extras, pricing, and step navigation.
- `scripts/calendar.js` configures Flatpickr date fields.
- `scripts/currency.js` fetches currency rates and updates visible prices.
- `scripts/email.js` validates and sends booking inquiries through EmailJS.
- `scripts/shared/*` contains early shared helper modules for future refactoring.

## Local Development

Use a static file server from the project root. Do not open pages directly from the filesystem because root-relative paths such as `/scripts/...` and `/assets/...` need an HTTP origin.

Example:

```powershell
npx serve .
```

Then open the printed local URL in a browser.

## Vercel Deployment

The project is configured as a static Vercel site. `vercel.json` enables clean URLs and security headers, including a Content Security Policy. If a new third-party script, image, API, or frame provider is added, update the CSP before deployment.

## Third-Party Services

The Supabase anon key, EmailJS public key, and hCaptcha site key are public browser keys. They are not secrets. Security must come from Supabase Row Level Security, service-side captcha verification, provider restrictions, and careful data access rules.

## Security Notes

- Verify Supabase Row Level Security before production.
- Do not expose service-role keys or private API keys in client-side JavaScript.
- Move email sending and captcha verification to a serverless endpoint before accepting real bookings.
- Render Supabase data with `textContent` or safe DOM helpers instead of raw `innerHTML`.
- Keep booking/form routes `noindex` while the site is not operational.

## Code Quality Rules

- Any script using `import` must be loaded with `type="module"`.
- Guard DOM access in shared scripts before calling `.addEventListener`, `.style`, `.textContent`, or `.value`.
- Keep page-specific code loaded only on pages that need it.
- Prefer shared helpers for dates, DOM access, rendering, caching, and currency behavior.
- Avoid duplicated large HTML blocks such as repeated time options.
- Avoid inline styles except for temporary or component-loaded legacy code.

## Testing Checklist

- Run JavaScript syntax checks for every file in `scripts/`.
- Load the homepage and confirm there are no console errors.
- Submit a homepage search and confirm fleet navigation works.
- Load the fleet page and test sorting, filters, mobile date display, and currency changes.
- Load a car detail page and test gallery, price display, share button, and booking link.
- Load the booking page and confirm step navigation, legal links, demo disclaimer, form validation, and pricing.
- Open Privacy Policy and Terms & Conditions from the footer.
- Confirm `robots.txt` still blocks fake booking/form routes.

## Known Technical Debt

- Several pages still duplicate long location and time select markup.
- Some page components are injected with `innerHTML`; database-driven content should be moved to safer DOM rendering.
- Language routing is incomplete and has legacy commented code.
- Email sending is currently client-side and should move behind a serverless endpoint before real bookings.
- Legal copy is a practical template and requires qualified Albanian legal review before production.
