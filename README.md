# AI CLUB — Children's Day 2026 AR Flower Gift

A personalised augmented-reality flower-gifting web app for 19 AI Club students.

## Features

- Personalised student gift pages at `/gift/:slug`
- A welcome screen, interactive 3D bouquet, AR launch, and appreciation message
- Admin dashboard at `/gift-admin`
- Individual QR PNG downloads and bulk ZIP export
- Printable A4 greeting-card layout (four cards per printed page)
- Vite, React 18, TypeScript, Tailwind CSS, and Google `<model-viewer>`

## Requirements

- Node.js 18 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The admin dashboard is at `/gift-admin`.

## Production build

```bash
npm run build
npm run preview
```

The build output is generated in `dist/`.

## Configure public QR URLs

For production QR codes, create a `.env` file based on `.env.example` and set:

```env
VITE_PUBLIC_URL=https://your-site.netlify.app
```

Do not include a trailing slash. Rebuild after changing this value.

## Deploy to Netlify

1. Push this project to GitHub.
2. In Netlify, choose **Add new site → Import an existing project**.
3. Select the GitHub repository.
4. Netlify reads `netlify.toml` automatically:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Set `VITE_PUBLIC_URL` in the Netlify environment variables to your final site URL, then redeploy.

The `netlify.toml` file includes the SPA fallback required for direct links such as `/gift/smruthi-v`.

## Student links

The 19 personalised routes are generated from `src/data/students.ts`. Update the names/slugs there if the student list changes.

## AR compatibility

The bouquet is loaded from the Khronos glTF Sample Assets CDN. AR availability depends on the device and browser. Android devices may use Scene Viewer, supported browsers may use WebXR, and iOS Quick Look generally requires a compatible USDZ asset. `bouquetModelUsdz` is currently empty, so iOS Quick Look may not be available until a USDZ model is supplied.

## Important deployment note

The `/gift-admin` page is not password-protected. Treat its URL as public or add authentication before using it for sensitive administration.
