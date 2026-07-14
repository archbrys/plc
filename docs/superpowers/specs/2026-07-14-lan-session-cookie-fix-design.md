# Fix session cookie for offline LAN kiosk deployment

## Problem

PLC-MC is deployed as a single Express process on a Raspberry Pi, served
plain HTTP over the local LAN (`http://raspberrypi.local`), with no
internet access and no TLS termination anywhere in the stack (per
`CLAUDE.md`: offline-first, single-server, no cloud dependency).

The session cookie is currently configured in `backend/src/app.ts`:

```ts
cookie: {
  httpOnly: true,
  sameSite: 'lax',
  secure: env.NODE_ENV === 'production',
  maxAge: 12 * 60 * 60 * 1000,
},
```

`secure: true` tells the browser to never send the cookie over a
non-HTTPS connection. Since production deployment is plain HTTP, this
means: in production mode, `POST /api/auth/login` succeeds and sets the
cookie, but the browser silently drops it on the next request. Students
and admins would appear to log in, then immediately lose their session —
no submitted answers, no admin actions would persist.

## Goal

Students and admins must be able to log in and use their respective
features (student: browse/submit quizzes, work through course chapters;
admin: manage question sets/courses, view submissions) on the kiosk,
entirely offline, over plain HTTP, in both `development` and
`production` `NODE_ENV`.

## Change

TLS is not part of this architecture and won't be added later — the
kiosk is LAN-only with no internet. So the cookie's `secure` flag should
not be derived from `NODE_ENV` at all; it should simply always be
`false`.

In `backend/src/app.ts`, change:

```ts
secure: env.NODE_ENV === 'production',
```

to:

```ts
secure: false, // LAN-only kiosk over plain HTTP, no TLS in this deployment
```

No other session settings change (`httpOnly`, `sameSite: 'lax'`,
`maxAge` stay as-is — they aren't affected by the HTTP/HTTPS question).
No new env var or config toggle, since HTTPS is explicitly out of scope
for this deployment, not just "not yet configured."

## Out of scope

This spec covers only the cookie fix. Other Raspberry Pi
deployment-readiness gaps identified during investigation (no systemd
unit for auto-restart/boot, no Prisma `binaryTargets` for
`linux-arm64`, port 80 binding strategy, unpinned Node `engines`,
placeholder `.env` values) are tracked separately and not addressed
here.

## Verification

- Build and start the server with `NODE_ENV=production`.
- Log in as a seeded student (`S1001` / `1234`) over plain HTTP and
  confirm the session persists across a page reload and a subsequent
  authenticated request (e.g. viewing a chapter or submitting a quiz).
- Log in as the seeded admin (`admin` / `admin123`) over plain HTTP and
  confirm the session persists across an admin action (e.g. viewing
  submissions).
