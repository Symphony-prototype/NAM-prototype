# NAM CMS 2.0 — static prototypes

Clickable HTML/React prototypes for Case Manager, Neutrals Portal, and Client Portal. Open the **hub** first, then pick a portal.

## Repository

**GitHub:** [github.com/symphonygroup/NAM-Prototype](https://github.com/symphonygroup/NAM-Prototype)

## View on GitHub Pages

Published site (after Actions deploy succeeds):

**https://symphonygroup.github.io/NAM-Prototype/index.html**

Start at the hub (`index.html`). These prototypes load JSX via **HTTPS** and `fetch`; use the published URL, not raw `file://` paths.

**URLs:** GitHub Pages serves the hub at **`…/NAM-Prototype/`** or **`…/NAM-Prototype/index.html`**. If someone opens **`…/NAM-Prototype`** without a trailing slash, a small script redirects so relative links to the portals still work.

## Publish / push updates

The local repo should use:

`origin` → `https://github.com/symphonygroup/NAM-Prototype.git`

Ensure the **`NAM-Prototype`** repository exists under **`symphonygroup`** and you have push access.

Then from this folder (sign in when prompted, or use SSH):

```bash
cd "/path/to/Prototypes"
git push -u origin main
```

To use **SSH** instead of HTTPS:

```bash
git remote set-url origin git@github.com:symphonygroup/NAM-Prototype.git
git push -u origin main
```

### Cursor / VS Code — GitHub extension

This workspace recommends **GitHub Pull Requests and Issues** (`.vscode/extensions.json`). When Cursor prompts to install **recommended extensions**, accept it—or install manually: extension ID `GitHub.vscode-pull-request-github`.

Sign in via the **Accounts** menu or Command Palette → **GitHub Pull Requests: Sign in**. Then use the **Source Control** view to **Sync / Push**.

### Enable Pages

1. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Open the **Actions** tab and confirm **Deploy GitHub Pages** succeeds.
3. Share **https://symphonygroup.github.io/NAM-Prototype/index.html**.

### Notes

- **`/.nojekyll`** disables Jekyll so static files are served as-is.
- Shared styles/scripts live in **`nam-design-system/`**; portal HTML references them with **`../nam-design-system/`** so nothing relies on symlinks (compatible with GitHub Pages).
- Local preview: run **`serve-prototypes.command`** (Mac) or `python3 -m http.server 8765 --bind 127.0.0.1` from this directory and open `http://127.0.0.1:8765/index.html`.

## Regenerating `file://` bundles (optional)

If you change `.jsx` sources and want offline `file://` bundles to match, run:

```bash
node scripts/build-all-file-fallbacks.mjs
```

GitHub Pages uses the HTTP + Babel path by default; fallbacks are optional for local disk opens.
