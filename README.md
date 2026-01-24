# MoneyControl Frontend

Frontend application for **MoneyControl** — a personal finance app for tracking expenses across multiple wallets, with sharing, catalog (categories/products), recurring costs, dashboard summaries, and CSV export.

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router
- React Query (@tanstack/react-query)
- Axios (custom `ApiClient` wrapper)
- Google OAuth login (Google Identity via `@react-oauth/google`)

## Requirements

- Node.js (recommended: current LTS)
- npm (or pnpm/yarn — commands below use npm)
- A running backend API (local dev defaults to `http://127.0.0.1:8000`)

## Quick start (local development)

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

This repo uses Vite env variables. For local dev, create or edit:

- `.env.development`

Example (current defaults):

```env
VITE_ENVIRONMENT=local

# DEV: we use Vite proxy, so origin stays empty and prefix is /api
VITE_API_ORIGIN=
VITE_API_PREFIX=/api

# Backend local URL for Vite proxy
VITE_DEV_BACKEND_URL=http://127.0.0.1:8000

VITE_API_TIMEOUT_MS=20000
VITE_LOG_LEVEL=DEBUG
VITE_AUTH_TOKEN_KEY=moneycontrol.auth.token

VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

### 3) Start the backend

Make sure your backend is running locally (default expected URL is `http://127.0.0.1:8000`).

### 4) Run the frontend

```bash
npm run dev
```

Vite will print the local URL (typically `http://localhost:5173`).

## How API calls work in local dev (Vite proxy)

Local dev is configured to call the API via a relative `/api` path.

- In `src/config/settings.ts`, local settings build:
  - `API_ORIGIN=""`
  - `API_PREFIX="/api"`
  - `API_BASE_URL="/api"`

- In `vite.config.ts`, the dev server proxies `/api/*` to your backend:

```ts
proxy: {
  '/api': {
    target: devBackend,
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
}
```

That means:
- Frontend requests go to: `GET /api/wallets/...`
- Vite forwards them to backend as: `GET /wallets/...` (prefix removed)
- You avoid CORS during local development.

## Production / remote environment

For a deployed frontend you typically want **absolute API URLs** (no Vite proxy).

Set:

- `VITE_ENVIRONMENT=remote`
- `VITE_API_ORIGIN=https://your-backend.example.com`
- `VITE_API_PREFIX=` (or `/api` if your backend uses a prefix)

`src/config/settings.ts` will build the final API base URL as:

- `API_BASE_URL = API_ORIGIN + API_PREFIX`

If `VITE_ENVIRONMENT=remote` and `VITE_API_ORIGIN` is missing, the app logs a warning in the console.

## Google login configuration

Login uses Google Identity via `@react-oauth/google` (`GoogleLogin` button).

You must set:

- `VITE_GOOGLE_CLIENT_ID`

In Google Cloud Console (OAuth Client ID):
- Add `http://localhost:5173` (or your Vite host) to **Authorized JavaScript origins**
- For production, add your deployed frontend origin.

Then login flow is:

1. User signs in with Google and receives an `id_token`.
2. Frontend calls backend: `authApi.loginWithGoogle(id_token)`.
3. Backend returns your app JWT.
4. Frontend stores the JWT in localStorage and continues to `/wallets`.

## Scripts

From `package.json`:

```bash
npm run dev          # start Vite dev server
npm run build        # typecheck + production build
npm run preview      # preview production build locally

npm run lint         # eslint
npm run lint:fix     # eslint --fix

npm run format       # prettier --write
npm run format:check # prettier --check

npm run typecheck    # tsc -b --pretty false
```

## Project structure

High level `src/` layout:

- `api/`
  - `apiPaths.ts` — single source of truth for endpoint paths
  - `client/` — Axios wrapper (`ApiClient`, `ApiError`)
  - `modules/` — domain API modules (`wallets`, `transactions`, `recurring`, etc.)
- `authentication/`
  - `handleToken.ts` — token storage helpers (localStorage)
- `config/`
  - `settings.ts` — environment config (local/remote)
- `features/` — domain UI modules (dashboard, transactions, recurring, etc.)
- `layouts/`
  - `AppLayout.tsx` — app shell + navbar + outlet
  - `WalletLayout.tsx` and `WalletLayoutInner.tsx` — wallet context shell
- `models/` — TypeScript types matching backend payloads
- `pages/` — route-level pages
- `queries/` — React Query hooks + `queryKeys.ts`
- `routes/`
  - `routePaths.ts` — typed route helpers + route patterns
  - `RequireAuth.tsx` — protected routing
- `ui/` — reusable UI components (Button, Modal, EmptyState, etc.)

## Routing and layouts

Routes are defined in `src/App.tsx`.

Top-level structure:

- `AuthLayout` for `/login`
- `RequireAuth` wraps the authenticated app
- `AppLayout` is the main shell (navbar + centered content container)
- `WalletLayout` wraps wallet-specific routes under `/wallets/:walletId/*`

Main routes:

- `/login`
- `/wallets` — list/create/switch wallets
- `/settings` — user settings
- `/wallets/:walletId/dashboard`
- `/wallets/:walletId/transactions`
- `/wallets/:walletId/categories`
- `/wallets/:walletId/products`
- `/wallets/:walletId/recurring`
- `/wallets/:walletId/members`

`routePaths.ts` provides:
- `routePaths` (helpers to build URLs)
- `routePatterns` (string patterns used for Route definitions)

## Authentication and session handling

- Login is done via Google `id_token` -> backend -> app JWT.
- The JWT is stored in localStorage under `settings.AUTH_TOKEN_KEY`.
- API requests attach the token via `ApiClient` interceptors.
- Global unauthorized handling:
  - When the API layer detects `401`, it dispatches an `auth:unauthorized` event.
  - `AppLayout` listens for `auth:unauthorized`, clears token storage, shows a toast, and redirects to `/login`.

## API architecture

### 1) `apiPaths` (single source of truth)

All endpoint URLs are defined in `src/api/apiPaths.ts`. Paths are grouped by domain and dynamic paths are functions.

This avoids hardcoding strings across the codebase.

### 2) `ApiClient` and `ApiError`

`src/api/client/ApiClient.ts` is a thin wrapper around Axios:
- sets base URL from `settings.API_BASE_URL`
- sets timeout from `settings.API_TIMEOUT_MS`
- attaches token automatically
- normalizes errors into `ApiError` for consistent UI handling

### 3) Domain API modules

`src/api/modules/*` exposes domain functions with a consistent convention:

- `getAll`, `getById`, `create`, `update`, `delete`
- plus domain actions, e.g.:
  - `transactionsApi.refund(...)`
  - `recurringApi.apply(...)`
  - `transactionsApi.exportCsv(...)`

This keeps API usage predictable across features and pages.

## React Query usage

- Query keys are centralized in `src/queries/queryKeys.ts`.
- Each data area has a dedicated hook in `src/queries/` (example: `useRecurringQuery`, `useWalletQuery`, `useSummaryByImportanceQuery`).
- Mutations invalidate affected keys using `queryClient.invalidateQueries(...)`.

Guidelines followed in this project:
- Use `enabled` to block requests when required inputs are missing (token, walletId, valid date range).
- Prefer invalidating *roots* (`queryKeys.wallets.*.root(walletId)`) after mutations, unless you know the exact query key.
- Use `retry: false` for endpoints where retry doesn’t help (auth/permission errors).

## UI conventions

The UI layer is intentionally small and reusable:

- `PageHeader` for consistent page title + actions
- `ConfirmModal` for destructive and confirmation flows
- `EmptyState` + `Spinner` used for loading/error/empty screens
- Tailwind classes are used directly in components; small helpers live in `ui/` (e.g., `importanceBadgeClass`)

## Adding a new endpoint (recommended workflow)

1. Add the path in `src/api/apiPaths.ts`.
2. Add a function in the appropriate `src/api/modules/*.api.ts`.
3. Add/update request/response types in `src/models/`.
4. Add a query key in `src/queries/queryKeys.ts`.
5. Create a query hook in `src/queries/useSomethingQuery.ts`.
6. Use the hook in the feature/page and handle:
   - loading state (Spinner)
   - error state (EmptyState with Try again)
   - empty state (EmptyState)
7. If you add a mutation, invalidate the relevant root keys.

## Troubleshooting

### API calls return 404 in local dev
Your frontend calls `/api/...` and Vite rewrites it to `/...` on the backend.
Make sure your backend routes do not include `/api` prefix, or adjust the proxy `rewrite`.

### API calls fail with network/CORS errors
In local dev you should not see CORS errors if:
- backend runs on `VITE_DEV_BACKEND_URL`
- you call the API via `/api/...` (relative)
- Vite proxy is active

If you set `VITE_API_ORIGIN` during local dev, you may bypass the proxy and trigger CORS.

### Google login fails
- Ensure `VITE_GOOGLE_CLIENT_ID` is set.
- Ensure Google Cloud Console has the correct **Authorized JavaScript origins** for your frontend URL.
- Make sure backend `GOOGLE_CLIENT_ID` matches the same client ID used on the frontend.

### Session expires immediately
If backend returns 401, the app dispatches `auth:unauthorized` and logs out.
Check:
- backend JWT secret/config
- system time differences
- token storage key (`VITE_AUTH_TOKEN_KEY`) matches the app settings.

---

## License

Private project (internal use).
