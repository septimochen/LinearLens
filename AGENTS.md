# Project instructions

1. For Python projects, use uv and add ruff, ty, and pytest as development dependencies. This frontend is TypeScript.
2. After completing a task, commit with a clear message. Push if a Git remote is configured.
3. Keep a Makefile at the project root for common commands.
4. Use a whitelist-style .gitignore.
5. Keep mathematical logic in src/math pure and independent of React.
6. Read relevant Next.js guides in node_modules/next/dist/docs before changing framework configuration.
7. This project has migrated to Cloudflare CLI (`cf`). Use `cf dev` and `cf deploy` through the npm scripts or Make targets for Workers preview and deployment. Do not switch back to direct Wrangler commands.
8. Keep `cloudflare.config.ts` and `wrangler.config.ts` tracked. The latter configures the Wrangler implementation used by `cf`; retain the Wrangler dependency and `wrangler build --experimental-new-config --experimental-cf-build-output` in `build:workers` to generate Build Output for `cf deploy --prebuilt`. `cf dev` selects the framework development server.
9. Discover Cloudflare commands with `cf --help` or `cf cli search "<action and resource type>"`, then check the discovered command's help. Keep search queries free of account and resource identifiers.
