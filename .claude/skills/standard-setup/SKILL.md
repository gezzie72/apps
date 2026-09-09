---
name: standard-setup
description: >-
  Add the standard "Setup" panel to one of the single-file PWA apps in this repo
  (ideapad, healthlog, fitplan, vault, recipebox, financemanager, or a new one).
  The standard Setup panel bundles the settings every app here shares: Appearance
  (light / dark / system theme), Text size, GitHub Gist sync across devices,
  Export / Import JSON, and the shared "My apps" links list. Use this whenever the
  user says "add the standard setup", "add the usual setup panel", "add the standard
  setup panel", "give it the usual settings", or otherwise asks for the normal
  settings / sync / theme / text-size block behind a Setup button or tab — even if
  they only mention one part (e.g. "add sync" or "add a Gist ID box"), since those
  belong to the same shared block. Do NOT use this for unrelated per-app feature
  work that isn't about settings, theme, sync, or the apps list.
---

# Standard Setup panel

Every app in this repo is a **single self-contained `index.html`** (inline CSS + JS,
`localStorage` for data, optional GitHub Gist sync, PWA manifest + service worker).
They share the same "Setup" area. This skill adds that shared area to whichever app
you're working on, matching that app's existing look and conventions.

## The five standard blocks

Add these under a **Setup** section (a tab in a tabbed app like healthlog, or a ⚙
button opening a modal like ideapad — follow the target app's existing navigation):

1. **Appearance** — theme buttons: **System / Light / Dark**. Persist per-device;
   apply immediately; keep the `<meta name="theme-color">` in step.
2. **Text size** — **Small / Medium / Large / Extra large**, driving a `--tscale`
   CSS multiplier on the root. Persist per-device.
3. **Sync across devices (GitHub Gist)** — password field for a **classic token
   (gist scope)**, an optional **Gist ID** box (auto-detected if blank), **Connect
   / Sync now / Disconnect**, and an **Auto-sync** toggle. Each app uses its **own
   separate gist**.
4. **Data** — **Export JSON** and **Import JSON** (import merges, never blind-overwrites).
5. **My apps** — the shared links list (canonical list below), so any app can reach
   the others and be installed to the home screen.

## How to build it — copy, don't reinvent

The reliable way is to **adapt the most complete existing implementation** rather than
writing sync/theme code from scratch. Read these first and lift their patterns:

- **`healthlog/index.html`** — the fullest reference: tabbed nav, theme, text size,
  Gist sync **with optional passphrase encryption**, export/import, My apps.
- **`ideapad/index.html`** — the modal/⚙-button variant of the same building blocks.

Steps:

1. **Read the target app's `index.html` end to end first.** Note its CSS variable
   names, class names, nav style (tabs vs modal), and how it stores state. If it
   already has some of these blocks, **extend what's there — never duplicate**.
2. **Copy the closest existing implementation** (tabbed → healthlog, modal → ideapad)
   and adapt it to the target app's markup and theme tokens so it looks native.
3. **Give the app its own storage + gist identity.** Namespace everything to the app:
   - `localStorage` keys like `<app>.theme`, `<app>.textScale`, `<app>.gh.token`,
     `<app>.gh.gist`, `<app>.gh.auto`, and the app's own data key.
   - Gist file named `<app>.json`, gist description `"<AppName> sync"`. Auto-detect
     the app's gist by that filename/description so it never collides with the other
     apps' gists.
4. **Wire sync to the app's save path** (auto-push on change when connected +
   auto-sync on, pull on load/focus, last-write-wins merge, tombstones for deletes)
   exactly as the reference app does.
5. **Keep the token client-side.** It lives only in that browser and is sent only to
   GitHub's API. Say so in the UI copy, and link the classic-token page:
   `https://github.com/settings/tokens/new?scopes=gist&description=<AppName>%20sync`.

## Canonical "My apps" list

Include all of these (drop the entry for the app you're editing only if you prefer;
keeping it is fine). Emoji + name + link to `https://gezzie72.github.io/apps/<slug>/`:

- ✚ **HealthLog** — `healthlog`
- 🏋 **FitPlan** — `fitplan`
- 💡 **IdeaPad** — `ideapad`
- 🔐 **Vault** — `vault`
- 🥗 **RecipeBox** — `recipebox`
- 💷 **Finance Manager** — `financemanager`

Under it, a short line: "Open on any device, then use your browser menu → **Install**
/ **Add to Home screen**."

## Finish

- If the app shows a version string, bump it and note the change.
- **Verify in a browser before declaring done** (Playwright/Chromium is available):
  load the app, switch theme, change text size, open the sync UI, run export — confirm
  no console errors and settings persist across a reload. This is how the other apps
  in this repo were validated.
- Commit to the working branch. Ask before merging/deploying to `main` unless the
  user already said to deploy.
