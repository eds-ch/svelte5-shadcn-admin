# Changelog

Format: [CalVer](https://calver.org/) `YYYY.0M.MICRO`

## 2026.02.0

Initial public release.

### Features

- **Dashboard** — overview cards, bar chart, recent sales, analytics tab with area charts
- **Tasks** — data table with sorting, faceted filters, search, pagination, CRUD dialogs
- **Users** — user table with role/status badges, invite/edit/delete dialogs
- **Apps** — card grid with list/grid toggle, search, sort, category filter
- **Chats** — conversation list with message thread
- **Settings** — profile, account, appearance (4 theme presets + font picker), notifications, display
- **Auth** — sign in (2 variants), sign up, forgot password, OTP verification
- **Errors** — 401, 403, 404, 500, 503 pages
- **Layout** — collapsible sidebar (icon/offcanvas/none), team switcher, user dropdown, command palette, breadcrumbs, dark/light/system theme
- **i18n** — English, German, Russian, Chinese via Paraglide
- **Theme system** — 4 presets (default, modern-minimal, notebook, darkmatter), cookie-persisted, flash-free SSR

### Infrastructure

- SvelteKit with Svelte 5 runes, TypeScript strict mode
- shadcn-svelte (Bits UI), Tailwind CSS v4, OkLCH color system
- SuperForms + Formsnap + Zod for forms
- TanStack Table Core for data tables
- LayerChart for data visualization
- CSP headers, server-side cookie validation
