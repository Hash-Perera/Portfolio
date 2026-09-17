# Hashan Perera — Software Engineer

A responsive Next.js App Router portfolio with TypeScript, a light default theme, a persistent dark-mode toggle, accessible project dialogs, and a downloadable résumé.

## Run locally

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000.

## Content

`app/content.json` is the shared source for identity, contact information, skills, experience, projects, education, and publications. The portfolio is populated from Hashan's supplied CV. `app/portfolio.ts` exports this data for the website; the PDF generator reads the same file.

- Add the LinkedIn and GitHub profile URLs in `portfolio` when available. Social links appear once configured.
- Project and publication URLs are optional. Only supplied URLs are shown; no repository links are inferred.
- Project illustrations are workflow overviews, not screenshots of the original applications.
- Company logos are local assets under `public/companies/`, matched to the supplied references using the official [IGT1](https://www.linkedin.com/company/igt-i-lanka) and [DigitusTec](https://www.linkedin.com/company/digitustec) profiles.
- `public/resume.pdf` is a three-page résumé typeset from the supplied CV text. Both résumé buttons use this PDF.
- Update `app/page.tsx` for presentation changes and `app/globals.css` for styling.
- `app/layout.tsx` sets personalized search/social metadata. `NEXT_PUBLIC_SITE_URL` can override the trusted deployment origin.

## Build and checks

```sh
npm run lint
npm run build
npm start
```

The standard scripts use native Next.js. `npm run build:sites` provides the separate Vinext/Cloudflare build for Sites hosting.

To regenerate the résumé and review images, run `node scripts/create-resume.mjs`. The generator uses Arial on Windows; on other systems, provide `RESUME_FONT_REGULAR` and `RESUME_FONT_BOLD` font paths, or it falls back to standard PDF fonts. Review all three generated images under `tmp/pdfs/` after updates. `node scripts/create-icon.mjs` regenerates the personal monogram icon.

Contact links use email and telephone handlers. No contact form service or analytics is configured. The existing Sites publication remains private to the owner.
