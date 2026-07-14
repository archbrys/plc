# LAN Session Cookie Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop the session cookie from being marked `secure` in production, since this app is served over plain HTTP on a LAN kiosk with no TLS anywhere in the stack — as written, production logins set a cookie the browser then refuses to send back.

**Architecture:** One-line change to the `express-session` cookie config in `backend/src/app.ts`, verified by running the built production server locally and confirming a session survives past login for both a student and an admin account.

**Tech Stack:** Node.js, Express 5, `express-session`, TypeScript. No test runner in this repo (per `CLAUDE.md`) — verification is manual via `npm run build` + `npm start` and browser/API checks.

## Global Constraints

- Deployment is offline, LAN-only, plain HTTP, single Express process — no TLS now or planned (source: spec, "Goal" and "Change" sections).
- No new env var or config toggle — `secure` must be an unconditional `false`, not derived from `NODE_ENV` (source: spec, "Change" section).
- `httpOnly`, `sameSite: 'lax'`, and `maxAge` must remain unchanged (source: spec, "Change" section).
- Do not invent or add a test command — this repo has no test suite (source: `CLAUDE.md`).

---

### Task 1: Fix session cookie `secure` flag and verify login persists over HTTP

**Files:**

- Modify: `backend/src/app.ts:32-37`

**Interfaces:**

- Consumes: nothing new — uses the existing `session()` middleware call already present in `backend/src/app.ts`.
- Produces: nothing consumed by other tasks — this is the only task in the plan.

- [ ] **Step 1: Read the current cookie config to confirm line numbers**

Run: `sed -n '26,39p' backend/src/app.ts`

Expected output:

```ts
app.use(
  session({
    name: 'plc_mc_sid',
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
      maxAge: 12 * 60 * 60 * 1000,
    },
  }),
)
```

- [ ] **Step 2: Edit the cookie config**

In `backend/src/app.ts`, change this block:

```ts
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
      maxAge: 12 * 60 * 60 * 1000,
    },
```

to:

```ts
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      // LAN-only kiosk over plain HTTP, no TLS in this deployment — a
      // secure cookie would never be sent back by the browser.
      secure: false,
      maxAge: 12 * 60 * 60 * 1000,
    },
```

- [ ] **Step 3: Typecheck the backend**

Run: `npm run build --prefix backend`
Expected: exits 0, no TypeScript errors, produces `backend/dist/`.

- [ ] **Step 4: Build the frontend** (needed because `app.ts` serves `frontend/dist` and Task 5 runs the full production server)

Run: `npm run build --prefix frontend`
Expected: exits 0, produces `frontend/dist/`.

- [ ] **Step 5: Set NODE_ENV=production for a local verification run**

Run: `grep -n "^NODE_ENV" .env`
Expected: `NODE_ENV=development`

Edit `.env` and change that line to `NODE_ENV=production`. (This file is gitignored — it's local-only config, not something we commit.)

- [ ] **Step 6: Start the production server**

Run: `npm start`
Expected: log line `Server running at http://raspberrypi.local:3000` (or whatever `PORT` is set to), process stays running.

Leave this running in a background/second terminal for the next two steps.

- [ ] **Step 7: Verify student login persists a session over plain HTTP**

Run, from a fresh terminal (cookie jar file keeps the session across requests, exactly like a browser would):

```bash
curl -s -c /tmp/plc-mc-cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"role":"student","studentId":"S1001","pin":"1234"}'
echo
curl -s -b /tmp/plc-mc-cookies.txt http://localhost:3000/api/auth/me
```

Expected: first response has `"success":true` and a `Set-Cookie: plc_mc_sid=...` header was stored in `/tmp/plc-mc-cookies.txt` (check with `grep plc_mc_sid /tmp/plc-mc-cookies.txt`); second response returns `"success":true` with the student's own user data (role `STUDENT`, studentId `S1001`) — proving the cookie round-tripped and the session was recognized, not dropped.

(Payload shape is defined by `backend/src/validation/authSchemas.ts` — `role` is required alongside either `username`+`password` or `studentId`+`pin`.)

- [ ] **Step 8: Verify admin login persists a session over plain HTTP**

Run:

```bash
curl -s -c /tmp/plc-mc-cookies-admin.txt -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin123"}'
echo
curl -s -b /tmp/plc-mc-cookies-admin.txt http://localhost:3000/api/auth/me
```

Expected: same shape as Step 7 but with role `ADMIN` and username `admin`.

- [ ] **Step 9: Stop the server and revert local `.env`**

Stop the `npm start` process (Ctrl-C or kill the background job).

Run: `git diff .env`
Expected: shows `NODE_ENV` changed from `development` to `production`.

Revert it back since `.env` should stay in its normal dev state for day-to-day work:

Run: `git checkout -- .env`

- [ ] **Step 10: Clean up temp cookie files**

Run: `rm -f /tmp/plc-mc-cookies.txt /tmp/plc-mc-cookies-admin.txt`

- [ ] **Step 11: Commit**

```bash
git add backend/src/app.ts
git commit -m "$(cat <<'EOF'
Fix session cookie to work over plain HTTP on LAN kiosk deployment

secure was tied to NODE_ENV, so production logins set a cookie the
browser would never send back since this app has no TLS anywhere in
the stack.
EOF
)"
```
