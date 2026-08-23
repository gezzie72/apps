# Apps

Public HTTPS hosting (via GitHub Pages) for a set of installable web apps, so they
can be added to a phone's home screen and installed as standalone apps:

- **IdeaPad** — `/ideapad/` — cross-device idea notepad.
- **FitPlan** — `/fitplan/` — cross-device gym planner.
- **HealthLog** — `/healthlog/` — personal health tracker (glucose, meds, measurements).
- **Vault** — `/vault/` — encrypted password manager.
- **RecipeBox** — `/recipebox/` — diabetic-friendly cookbook with carbs-forward nutrition, allergen/diet filters, and a daily plate tracker.

Each app is a self-contained `index.html` plus a web app manifest, a service
worker (offline app shell), and icons. The apps store data locally and sync
across devices via a private GitHub gist; **no secrets are stored in these files**
(the sync token lives only in each device's browser).

The source of truth for each app lives in its own repo; the copies here are the
hosted, installable versions.

## Install on a phone (Chrome / Android)

1. Open the app's URL (e.g. `https://<user>.github.io/apps/ideapad/`).
2. Menu (⋮) → **Install app** (or **Add to Home screen**).
3. Launch it from the home-screen icon — it opens standalone and works offline.

On iOS use Safari → Share → **Add to Home Screen**.
