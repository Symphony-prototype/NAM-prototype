# NAM CMS 2.0 — static prototypes

Clickable HTML/React prototypes for Case Manager, Neutrals Portal, and Client Portal. Open the **hub** first, then pick a portal.

## Repository

**GitHub:** [github.com/symphony-prototype/NAM-prototype](https://github.com/symphony-prototype/NAM-prototype)

## Hosting (HTTPS required for live demos)

These prototypes load **React from a CDN** and **`.jsx` via `fetch`**, so viewers need a real **`https://`** (or **`http://localhost`**) origin — not raw **`file://`**.

### GitHub Pages (when your org allows it)

If **Settings → Pages** is available and **GitHub Actions** can deploy:

**https://symphony-prototype.github.io/NAM-prototype/index.html**

(GitHub username: **`symphony-prototype`**.)

If someone opens the repo URL **without** a trailing slash before paths, **`nam-design-system/github-pages-path.js`** redirects so relative links still work.

### GitHub Enterprise — GitHub Pages disabled

Many **GitHub Enterprise** setups disable **GitHub Pages** org-wide or block the **`pages: write`** permission. In that case the workflow **`.github/workflows/deploy-pages.yml`** may fail in Actions until an admin enables Pages (or you remove that workflow).

**Practical alternatives** (same repo, static files only — no build step):

| Option | Notes |
|--------|--------|
| **Ask your org admin** | Sometimes Pages can be turned on for specific repos or allowlisted. |
| **[Netlify](https://www.netlify.com/)** | Connect the GitHub repo; set **publish directory** to **`.`** (repo root). This repo includes a minimal **`netlify.toml`**. |
| **[Cloudflare Pages](https://pages.cloudflare.com/)** | Connect repo; build command empty or `exit 0`; output directory **`.`** / root. |
| **[Azure Static Web Apps](https://learn.microsoft.com/azure/static-web-apps/)** | Fits Microsoft-heavy enterprises; deploy this folder as static content. |
| **Internal web server** | Copy the repo (or CI artifact) to IIS, nginx, S3+CloudFront, etc. — any HTTPS static host at the **site root** works. |
| **Local only** | **`serve-prototypes.command`** or `python3 -m http.server …` — fine for desk demos, not for broad sharing. |

After you have **any** HTTPS base URL, share **`…/index.html`** (or **`…/`** if the host maps it to `index.html`).

## Publish / push updates

The local repo should use:

`origin` → `https://github.com/symphony-prototype/NAM-prototype.git`

Ensure the **`NAM-prototype`** repository exists under the **`symphony-prototype`** account and you have push access.

Then from this folder (sign in when prompted, or use SSH):

```bash
cd "/path/to/Prototypes"
git push -u origin main
```

To use **SSH** instead of HTTPS:

```bash
git remote set-url origin git@github.com:symphony-prototype/NAM-prototype.git
git push -u origin main
```

### Cursor / VS Code — GitHub extension

This workspace recommends **GitHub Pull Requests and Issues** (`.vscode/extensions.json`). When Cursor prompts to install **recommended extensions**, accept it—or install manually: extension ID `GitHub.vscode-pull-request-github`.

Sign in via the **Accounts** menu or Command Palette → **GitHub Pull Requests: Sign in**. Then use the **Source Control** view to **Sync / Push**.

### Notes

- **`/.nojekyll`** disables Jekyll so static files are served as-is.
- Shared styles/scripts live in **`nam-design-system/`**; portal HTML references them with **`../nam-design-system/`** so nothing relies on symlinks (compatible with static hosts).
- Local preview: run **`serve-prototypes.command`** (Mac) or `python3 -m http.server 8765 --bind 127.0.0.1` from this directory and open `http://127.0.0.1:8765/index.html`.
- If **Deploy GitHub Pages** always fails, delete or disable **`.github/workflows/deploy-pages.yml`** until Pages is enabled — pushes will still work; only automatic Pages deploy stops.

## Regenerating `file://` bundles (optional)

If you change `.jsx` sources and want offline `file://` bundles to match, run:

```bash
node scripts/build-all-file-fallbacks.mjs
```

Over HTTPS, hosts use the Babel + `fetch` path by default; fallbacks are optional for opening HTML from disk.
