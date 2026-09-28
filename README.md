# griffinseibold.com

Source for [griffinseibold.com](https://griffinseibold.com), built with
[Astro](https://astro.build) and deployed to GitHub Pages.

## Develop

Requires Node.js 24 (see `.node-version`).

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serve dist/ locally
```

## Layout

| Path                           | Contents                                              |
| ------------------------------ | ----------------------------------------------------- |
| `src/site.ts`                  | Name, links, and the smaller projects list             |
| `src/content/projects/`        | Project write-ups in MDX, one file per project        |
| `src/pages/`                   | Routes                                                |
| `src/components/`, `layouts/`  | Shared UI                                             |
| `src/styles/global.css`        | Design tokens and base styles                         |

## Deploy

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the site and publishes it to GitHub Pages. Pull requests run the
build without deploying.
