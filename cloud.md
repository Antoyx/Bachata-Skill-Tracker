# Cloud & Offline Functionality

Bachata Tracker is a **PWA (Progressive Web App)** that works both online and offline. This document explains how data is stored and synced.

## Online mode

When the device has an internet connection:

- All data is read from and written to **Supabase** (PostgreSQL) in real time via the Supabase JS client.
- Skills and variations are stored in the `skills` and `variations` tables, scoped per `user_id`.
- A local cache is kept in `localStorage` (`bachata_cache_v2_<userId>`) so the app loads instantly on repeat visits without waiting for a network round-trip.

## Offline mode

When the device loses its connection, the app continues to work:

- The app detects `navigator.onLine` and listens to `window offline` / `window online` events.
- An **offline banner** is displayed at the top of the screen while disconnected.
- All changes (add, edit, delete, focus-toggle) are written immediately to the local cache so the UI stays responsive.
- Each write that cannot reach Supabase is queued as a **pending operation** in `localStorage` (`bachata_pending_<userId>`).

## Syncing on reconnect

When the device comes back online, the pending queue is replayed:

1. Duplicate or superseded operations are collapsed (e.g. multiple edits to the same skill become one `UPDATE`).
2. Each operation is replayed against Supabase in order.
3. On success the queue is cleared, the cache is refreshed from Supabase, and the banner is hidden.
4. On failure the remaining operations are kept and a "Sync failed" message is shown; the sync will retry on the next reconnect.

## Auth offline

- On a successful sign-in, minimal user info (`id`, `email`) is saved to `localStorage` (`bachata_offline_user`).
- If the app is opened while offline and a cached session exists for that user, the app restores the session automatically without showing the login screen.
- Creating a new account requires an internet connection.
