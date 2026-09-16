# Software engineer portfolio

A responsive Next.js App Router portfolio with TypeScript, default light theme, a persistent dark-mode toggle, native accessible project dialogs, and a downloadable résumé.

## Run locally

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000.

## Customize

- Edit `app/portfolio.ts` for your name, initials, email, GitHub, LinkedIn, projects, and skills. Social links appear after their URLs are set.
- Edit the introduction, about, and experience copy in `app/page.tsx`. Work history and projects are explicitly marked as samples.
- Replace `public/resume.pdf` with your actual résumé. Remove the sample résumé note in `app/page.tsx` afterward.
- Update page titles and descriptions in `app/layout.tsx`. Set `NEXT_PUBLIC_SITE_URL` to your trusted deployment origin for absolute social-preview URLs.
- Replace `public/og.png` if you change the site's visual identity.

## Validate and build

```sh
npm run lint
npm run build
npm start
```

The standard scripts run native Next.js. `npm run build:sites` provides the separate Vinext/Cloudflare build for Sites hosting. The PDF generation helper is optional: `node scripts/create-resume.mjs` regenerates the sample PDF and a local review image.

No contact form service or analytics is configured. Contact uses a mailto link; replace the example email before sharing.
