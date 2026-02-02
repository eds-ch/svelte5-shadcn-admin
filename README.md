# Shadcn Admin — Svelte 5

A Svelte 5 / SvelteKit rewrite of [shadcn-admin](https://github.com/satnaing/shadcn-admin) by [@satnaing](https://github.com/satnaing).

The original is a React admin dashboard. This project takes the same pages, the same interactions, and the same UX, and rebuilds everything on top of Svelte 5 and SvelteKit. It is not a mechanical port — React-specific patterns (Context providers, Zustand, TanStack Router, react-hook-form) were dropped in favor of SvelteKit-native equivalents.

## Differences from the original

shadcn-admin is a client-side React SPA. This version is a server-rendered SvelteKit application.

What that means in practice:

- **Routing** is file-based. Route groups `(app)` and `(auth)` replace TanStack Router configuration. No router config files, no route trees.
- **Data loading** goes through SvelteKit `load` functions, not client-side fetching with TanStack Query.
- **Forms** use SuperForms + Formsnap + Zod with SvelteKit form actions instead of react-hook-form.
- **State** is managed with Svelte 5 runes (`$state`, `$derived`) and the context API. No stores, no Zustand, no provider component chains.
- **User preferences** (theme, sidebar state, font) are persisted in cookies and read server-side, so the page renders correctly on first load without any flash.

Beyond the framework change, the project added a few things the original does not have:

- **4 color themes** — default, modern-minimal, notebook, darkmatter (from [tweakcn](https://tweakcn.com)) — on top of the standard light/dark/system toggle.
- **i18n** via Paraglide with English, German, Russian, and Chinese translations.
- **LayerChart** for data visualization (replacing Recharts from the original).

## Pages

- **Dashboard** — overview cards, bar chart, recent sales list; analytics tab with additional charts
- **Tasks** — data table with sorting, faceted filters (status, priority), search, pagination, row actions, CRUD dialogs
- **Users** — user table with role/status badges, invite/edit/delete dialogs
- **Apps** — application card grid with list/grid view toggle
- **Chats** — conversation list with message thread view
- **Settings** — profile, account, appearance (theme and font picker), notifications, display
- **Auth** — sign in (two layout variants), sign up, forgot password, OTP verification
- **Errors** — 401, 403, 404, 500, 503

## Tech stack

| Layer | Library |
|---|---|
| Framework | [SvelteKit](https://svelte.dev/docs/kit) + [Svelte 5](https://svelte.dev/docs/svelte) |
| Language | TypeScript (strict) |
| UI components | [shadcn-svelte](https://next.shadcn-svelte.com) (built on [Bits UI](https://bits-ui.com)) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Icons | [Lucide](https://lucide.dev) |
| Charts | [LayerChart](https://layerchart.com) |
| Data tables | [TanStack Table](https://tanstack.com/table) (core, with Svelte adapter) |
| Forms | [SuperForms](https://superforms.rocks) + [Formsnap](https://formsnap.dev) + [Zod](https://zod.dev) |
| Toasts | [svelte-sonner](https://svelte-sonner.vercel.app) |
| i18n | [Paraglide JS](https://inlang.com/m/gerre34r/paraglide-js) |
| Resizable panels | [Paneforge](https://paneforge.com) |

## Getting started

```bash
pnpm install
pnpm dev
```

For production build:

```bash
pnpm build
pnpm preview
```

Other commands:

```bash
pnpm check          # svelte-check (type errors)
pnpm lint           # ESLint
pnpm format         # Prettier
```

## Customizing

**App name.** Change `APP_NAME` in `src/lib/config.ts`. It controls the page title suffix and sidebar branding.

**Mock data.** All page data is static — generated with [Faker](https://fakerjs.dev) in `routes/*/data/` files, returned from SvelteKit `load` functions in `+page.ts`. To connect a real backend, replace the imports in load functions with `fetch` calls or database queries. The page components receive data through `$props` and don't care where it came from.

**Auth.** The sign-in, sign-up, OTP, and forgot-password pages are presentational only. No auth provider is connected. `hooks.server.ts` contains a commented auth guard skeleton ready to be wired up.

**Adding pages.** Create a directory under `src/routes/(app)/` with a `+page.svelte` file. The `(app)` route group provides the sidebar layout automatically. Add a `+page.ts` if the page needs data loading.

## Before production

This template ships with static mock data and no real auth. Before deploying to production:

- **Add server-side form actions.** Forms currently run in `SPA: true` mode (client-only validation). Create `+page.server.ts` files with Zod validation for auth and settings forms so they work without JavaScript and validate on the server.
- **Add auth middleware.** Implement session validation in `hooks.server.ts` to protect `(app)` routes. The file already uses `sequence()` — add your auth handler there.
- **Add `Secure` cookie flag.** All preference cookies are set without `Secure` for local development. Enable it in your production HTTPS environment.

## Credits

- [shadcn-admin](https://github.com/satnaing/shadcn-admin) by Sat Naing — the original React dashboard this project is based on
- [shadcn-svelte](https://next.shadcn-svelte.com) by huntabyte — Svelte port of shadcn/ui
- [tweakcn](https://tweakcn.com) — source of additional color theme presets
- [DiceBear](https://dicebear.com) / [Notionists](https://heyzoish.gumroad.com/l/notionists) by Zoish — avatar illustrations (CC0)

## License

MIT
