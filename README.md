# NexaDataEase — Company Website

The public marketing site for NexaDataEase Limited, built with Next.js
(pages router) and Tailwind CSS. Fully responsive from mobile up.

## Pages

- `/` — Home (animated headline, product previews)
- `/about` — Company story, registration, how we build
- `/projects` — Portfolio overview: DataEase, TruBook, DataEase Backend
- `/projects/dataease`, `/projects/trubook`, `/projects/dataease-backend` — individual product pages with screenshots and a "Visit [app]" button
- `/team` — Team page (placeholder cards — fill in real people)
- `/contact` — Contact details + email form

Uses your real logo (`public/images/logo-full.png`, `public/images/logo-icon.png`,
cropped from the file you supplied) throughout — nav, footer and favicon.

## Getting started

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Before you launch

- [ ] Replace the placeholder email (`hello@nexadataease.com`) and any
      phone/social links with real ones.
- [ ] Add your CAC/RC number in `components/Footer.js` and `pages/about.js`
      if you want it public (currently says "on request").
- [ ] Swap the `/contact` form's `mailto:` action for a real form service
      (Formspree, Resend, etc.) — `mailto:` forms are unreliable on mobile.
- [ ] Set the real `appUrl` for each product (currently `"#"`) in
      `pages/index.js`, `pages/projects.js`, and each
      `pages/projects/<product>.js` file — link to the App Store, Play
      Store or website for DataEase and TruBook.
- [ ] Add real screenshots. Drop image files into `public/images/`, then
      pass their path as the `image` prop on `<ProductPanel>` or the
      `screenshots` array on `<ProductDetail>` — every dashed-border box
      you see on the site is a placeholder waiting for a real photo.
- [ ] Fill in `pages/team.js` with real names, roles and headshots.

## Deploying

The fastest path is [Vercel](https://vercel.com) (built by the Next.js
team, free for projects like this):

1. Push this repo to GitHub (see below).
2. Go to vercel.com → New Project → import the repo.
3. Leave the defaults (Framework: Next.js) and deploy.

Every push to `main` will auto-deploy after that.

## Pushing to GitHub

```bash
git init
git add .
git commit -m "NexaDataEase company website"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

If you want this to replace the old `dataEaseWb` repo's content, you can
instead clone that repo, delete its old files, copy these files in, and
push to the same remote.
