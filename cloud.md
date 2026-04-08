# Bachata Skill Tracker — Offline & Cloud Sync

This app works offline. Data is backed by Supabase (cloud), but the app is designed to remain fully usable with no network connection.

---

## How offline mode works

### App shell caching (Service Worker)

`sw.js` registers a service worker that pre-caches the app shell on first load:

- `index.html`
- `style.css`
- `app.js`
- Supabase JS client (CDN)

Subsequent loads use a **cache-first** strategy for these assets, so the app opens instantly — even with no internet. Supabase API calls bypass the service worker and go directly to the network; the app handles those independently.

### Local data cache

On every successful Supabase fetch, all skill data is written to `localStorage` under the key `bachata_cache_v2_<userId>`. On next load:

1. Cached data is rendered immediately — no loading spinner.
2. A fresh fetch runs in the background to update the cache.

If the network fetch fails and a cache exists, the app silently falls back to the cached view. If there is no cache and the fetch fails, an error alert is shown.

### Pending operations queue

All writes (add, update, delete, toggle focus) check `isOnline` before calling Supabase. When offline, the operation is applied to the in-memory data immediately (optimistic UI) and pushed to a `localStorage` queue under `bachata_pending_<userId>`:

| Operation | What is queued |
|---|---|
| `addSkill` | Full skill row including generated UUID |
| `updateSkill` | Changed fields + skill ID |
| `deleteSkill` | Skill ID |
| `toggleSkillFocus` | Skill ID + new `working_on` value |
| `addVariation` | Full variation row including generated UUID |
| `updateVariation` | Changed fields + variation ID |
| `deleteVariation` | Variation ID |
| `toggleVariationFocus` | Variation ID + new `working_on` value |

Each entry includes a timestamp (`ts`) so the order of operations is preserved.

### Sync on reconnect

When the browser fires the `online` event, `syncPendingOps()` runs automatically:

1. **Collapse redundant ops** — before replaying, the queue is pruned:
   - If a skill or variation was added and later deleted offline, both ops are dropped (no-op net effect).
   - Multiple `updateSkill` / `updateVariation` entries for the same record are collapsed to just the last one.
2. **Replay in order** — each remaining op is sent to Supabase sequentially.
3. **Partial failure** — if an op fails mid-queue, the remaining ops are kept and the banner shows "Sync failed — will retry on reconnect".
4. **Success** — the queue is cleared, the banner hides, and fresh data is loaded from Supabase.

### Offline banner

A banner appears at the top of the app whenever:

- The device goes offline (`"You're offline — changes saved locally"`)
- A sync is in progress (`"Syncing changes..."`)
- A sync fails (`"Sync failed — will retry on reconnect"`)

The banner disappears automatically once sync completes successfully.

---

## PWA installation

`manifest.json` enables the app to be installed as a standalone PWA on Android and iOS. Once installed, it launches without browser chrome and opens directly from cache via the service worker.

---

## Data flow summary

```
User action
    │
    ▼
Update in-memory data + re-render (always instant)
    │
    ├── [online]  ──► Supabase write ──► update localStorage cache
    │
    └── [offline] ──► enqueue to localStorage pendingOps
                          │
                          └── [reconnect] ──► collapse + replay ──► Supabase
                                                                   ──► reload fresh data
```

---

## localStorage keys

| Key | Purpose |
|---|---|
| `bachata_cache_v2_<userId>` | Last-known full skill data snapshot |
| `bachata_pending_<userId>` | Ordered queue of offline mutations |
