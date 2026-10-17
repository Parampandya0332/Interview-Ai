# Authentication deployment configuration

The Vercel frontend proxies `/api/*` to the Render backend. Keep `VITE_API_URL=/api/auth` so browser requests and auth cookies stay on the deployed site origin, which also works better in mobile browsers that restrict third-party cookies.

Set `FRONTEND_ORIGINS` in the backend deployment to a comma-separated list of exact allowed frontend origins, with no trailing slash. Include the production Vercel URL and any custom domain. The same-origin proxy lets the auth cookie use `SameSite=Lax`; if you bypass the proxy and call the backend directly from another site, set `COOKIE_CROSS_SITE=true` (HTTPS required). Keep `JWT_SECRET` and `MONGO_URI` configured in the backend deployment environment.
