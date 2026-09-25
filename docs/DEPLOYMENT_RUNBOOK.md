# Deployment and CI recovery runbook

Keep this file as the project's persistent record of deployment failure modes. Every new recurring CI/build failure should get a short cause, prevention check, and recovery step here. This is documentation, not a guarantee against platform outages.

## When Cloudflare is stuck on Initializing

**Important:** Initializing is before cloning and before the repository's build command executes. GitHub commits, TypeScript fixes and wrangler.toml changes cannot directly repair a Cloudflare-side queue, GitHub authorization handshake or service incident.

1. Check GitHub Actions > TypeScript check on main. If green, the repository builds on GitHub independently of Cloudflare's builder.
2. Check Cloudflare's official status page and the Workers & Pages deployment/build logs. If Cloudflare reports an incident, wait or use the GitHub deployment fallback below.
3. In the Cloudflare dashboard verify the project is connected to the correct GitHub repository (StackPilotMAX/flythebg) and production branch (main). Check the GitHub App's repository access and reconnect the Git integration if its authorization expired. Avoid deleting the live project or domain as a first troubleshooting step.
4. For Workers Builds, use build command `npm run build` and deploy command `npx wrangler deploy` if using the ordinary Cloudflare Workers build flow. The required HF_ACCESS_TOKEN runtime secret must be set on the production Worker in the Cloudflare dashboard. Do not publish it as a repository variable or commit it.
5. If the integration remains stuck, use the independent **Deploy Cloudflare (GitHub fallback)** workflow instead. It runs the same build in GitHub Actions and publishes through the Cloudflare API; it does not depend on Cloudflare cloning the repository.

## Set up the fallback (one-time)

In GitHub repository Settings > Secrets and variables > Actions, add these **repository or production environment secrets**:
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with Workers Scripts Edit permission and appropriate account scope.
- `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account ID.

In the Cloudflare dashboard, add `HF_ACCESS_TOKEN` as a **Worker runtime secret** for the production Worker. The GitHub fallback intentionally does **not** read or upload this secret; keep it in Cloudflare and verify that it persists after deploying. Never add it to the repository or build logs.

In GitHub > Actions > **Deploy Cloudflare (GitHub fallback)** > Run workflow, select `main`. Optionally set `verify_url` to `https://flythebg.com` to test the live site after deployment. If the job cannot access secrets, check whether GitHub's `production` environment has required reviewers or environment-scoped secrets.

The fallback is manual-only so it does not race with Cloudflare's automatic deployments or deploy unreviewed changes. Once Cloudflare's Git integration works, use one deployment route at a time.

## Failure-prevention checks

- TypeScript errors (including nullable DOM references and functions accidentally declared inside another function): `npm run typecheck` in CI before building.
- Missing or empty public assets: `node scripts/check-build.mjs` after `npm run build` in both CI and fallback deployment.
- Wrong entrypoint or missing API route: artifact smoke test checks the Worker route and HTML app entry.
- Hanging GitHub jobs: CI and fallback jobs have explicit timeouts; deployments are serialized.
- Cloudflare credential failures: the fallback validates API token/account ID presence before deployment.
- Production health: optional live HTML verification on manual deploy; it does not test private Hugging Face processing.

## Known constraints

GitHub CI success verifies the repository build, not Cloudflare queue health, custom-domain DNS, a live deployment, or the private Hugging Face Space. A Cloudflare build stuck before clone requires dashboard/status/integration investigation or an independent deployment path. Do not claim production is fixed solely because CI is green.

After any failure, inspect the exact failing step and logs before changing unrelated UI code. Add a regression check where possible, then document the cause here.
