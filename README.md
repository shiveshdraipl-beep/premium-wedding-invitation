# Premium Digital Wedding Invitation

A mobile-first React + Vite wedding invitation inspired by the *feel* of modern digital wedding invitations, without copying any specific reference design, text, images, or branding.

## 1. Install

```bash
npm install
```

## 2. Run locally

```bash
npm run dev
```

Open the local URL shown by Vite.

## 3. Build for deployment

```bash
npm run build
```

The production files will be in `dist/`.

## 4. Personalize

Open:

`src/config.js`

Edit the bride/groom names, dates, events, venue, map link, photos, music and WhatsApp number.

### Important

Replace every value surrounded by `[ ... ]`.

For the countdown, use an ISO date such as:

`2027-02-14T18:30:00+05:30`

### Photos

The included image URLs are temporary demo images. Replace them with your own hosted image URLs, preferably optimized WebP/JPEG files.

### Music

The browser will NOT unexpectedly autoplay audible music. The music control starts muted. Guests can unmute it manually.

### RSVP

The form demonstrates the guest experience locally. For a real shared guest list, connect the submit handler to a backend/database such as Supabase, Firebase, Formspree, or your own API.

The WhatsApp button works as a no-backend RSVP fallback.

### Share

On browsers supporting Web Share API, the Share button opens native sharing. Otherwise it copies the invitation URL.

## Deployment

This is a static Vite site and can be deployed to Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any static hosting provider.

For Vercel:

```bash
npm install -g vercel
vercel
```

No login is required for guests; they only open the deployed URL.
