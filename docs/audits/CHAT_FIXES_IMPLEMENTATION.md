# Chat Fixes — Implementation Report

Follows `CHAT_FEATURE_AUDIT.md` (unchanged). Finding IDs (S1, F2, A1, …) refer to that audit.

**Outcome:**
- Every P0, P1 and P2 item in the task is implemented, with regression tests.
- Server: 310 of 310 tests pass. Typecheck, lint and build are clean.
- Web: 984 of 985 tests pass. The one failure is the pre-existing `ContactCard` test. Lint is at its pre-existing baseline of 12 problems, none in changed files. The build passes.
- Nothing was committed or pushed.
- **Before committing the web repo, read section 11.** New files must be staged with the lowercase `src/components/` path, or the Linux deploy will fail.

---

## 1. Findings addressed, by severity

| Audit ID | Severity | Status after this work |
|---|---|---|
| S1 | High | **Fixed.** Suspended or banned accounts lose admin access, refresh, and sockets. |
| S2 | High | **Fixed.** Uploads are validated by their content (magic bytes). The server picks the extension. Downloads are safe. |
| S3 | Medium | **Fixed.** Sockets are disconnected on suspend or ban, and re-validated periodically. |
| S4 | Medium | **Fixed for new attachments.** Private storage, signed links with membership checks, cleanup on delete. Legacy public files are unchanged; see section 4. |
| F1 | Medium | **Fixed.** Reads that happen while the tab is hidden are reconciled when it becomes visible. |
| F2 | Medium | **Fixed.** Auto-scroll only near the bottom, plus a "New messages" button. Older-page scroll position is kept. |
| A1 | Medium | **Fixed.** Copy, Edit and Delete can be reached and seen with the keyboard. |
| S5 | Low | **Fixed for new attachments.** Attachments are referenced by an owner-scoped key. Type and size come from the file on disk. |
| S7 | Low | **Fixed.** Per-account limits for sending and uploading; typing is throttled on the server. |
| S8 | Low | **Fixed (audit only).** Admin deletes write a `ModerationLog` entry. Deletes are still hard deletes; that is a product decision. |
| F3 | Low | **Fixed.** Thread pages use a `(createdAt, id)` cursor for users and admins. |
| F4 | Low | **Fixed.** Conversation lists use an `(updatedAt, id)` cursor. |
| P1 | Low | **Fixed.** Participant user payloads are trimmed to display fields. |
| P3 | Low | **Partly fixed.** Loading the latest page now does one membership check instead of two. Client-side mark-read batching was not changed. |
| F7 | Low | **Partly fixed.** Files are removed when their messages or conversations are deleted. Uploads that are never sent are not swept yet. |
| A2 | Low | **Fixed.** The moderation Remove button shows on keyboard focus and has a specific label. |
| A3 | Low | **Fixed.** The thread is a `log` region, and new messages get a short, polite announcement. |
| Architecture | — | **Fixed.** Shared chat helpers moved to `server/src/shared/chat`. The duplicate image helper is removed. |
| F5, F6, F8, F9, F10, P2, S9 | Low or Info | **Not in this task's scope; unchanged.** See section 4. |
| S6 | Low | **Product decision; unchanged.** See section 9. |

---

## 2. Files changed and why

### Server (`server/`)

**Account status and sessions (S1, S3)**
- `src/modules/auth/auth.service.ts`: `refresh` rejects SUSPENDED or BANNED users. The presented token is revoked first.
- `src/modules/admin/users/users.service.ts`: `updateStatus` revokes all refresh tokens and disconnects sockets on suspend or ban.
- `src/modules/admin/index.ts`, `admin/messages/messages.routes.ts`, `admin/users/users.routes.ts`: add `requireActiveUser`.
- `src/realtime/socket.ts`:
  - `disconnectUser`.
  - A periodic session sweep that disconnects sockets whose account is no longer ACTIVE or whose access token has expired. Clients receive `session:expired`.
  - The typing throttle (S7).

**Upload validation (S2)**
- `src/shared/files/fileType.ts` (new): content-based type detection. Supported types:
  - Images: JPEG, PNG, GIF, WebP.
  - Documents: PDF; legacy Office (DOC, XLS, PPT); OOXML (DOCX, XLSX, PPTX). Macro-enabled OOXML is rejected.
  - Video: MP4 (allow-listed brands) and MOV.
  - Rejected: dangerous extensions and MIME types, unrecognised content, and files whose kind (image, document or video) doesn't match the declared name or type.
  - Original names are sanitised.
- `src/shared/files/serveHeaders.ts` (new): `X-Content-Type-Options: nosniff`, a `sandbox` CSP, and `Content-Disposition` (inline for raster images, attachment for everything else).
- `src/middleware/upload.ts`:
  - Stages files under a random name.
  - Detects and judges each file, then renames accepted files to `<timestamp>-<random><detected ext>`.
  - Deletes every staged file in the request if any one is rejected.
  - Enforces file-count, field-count and field-size limits.
- `src/middleware/errorHandler.ts`: maps multer limit errors to 413 or 400 with clear messages.
- `src/app.ts`: `/uploads` static serving gets the security headers, ignores dotfiles, and has no directory index or redirects. Mounts the signed attachment route.
- `src/modules/uploads/uploads.routes.ts`: `requireActiveUser` and the upload rate limit.
- `src/config/env.ts`: new upload settings (section 7).
- `.gitignore`: `private-uploads/` and `uploads/.incoming/`.

**Attachment access and cleanup (S4, S5, F7)**
- `src/shared/chat/attachments.ts` (new):
  - Private storage keys (`<ownerId>/<file>`).
  - HMAC-signed, expiring links bound to a conversation.
  - Owner checks when sending; type and size read from disk.
  - Reference-counted file removal.
- `src/shared/chat/attachmentRoutes.ts` (new):
  - `POST /api/v1/messages/attachments` (authenticated upload).
  - `GET /chat-attachments/:conversationId/:ownerId/:file?exp&sig`. It checks the signature and expiry, then that a message in that conversation still references the file. Responses use `nosniff`, the sandbox CSP, `Referrer-Policy: no-referrer` and private caching.
- `src/modules/user/messages/messages.service.ts`:
  - Stores resolved attachments.
  - Removes unreferenced files after a message delete, or when the last member leaves.
  - Cursor pagination.
  - A single membership check on the latest-page load.
- `src/modules/user/messages/messages.routes.ts`: attachment upload route and the send rate limit.
- `src/modules/user/messages/messages.validators.ts`: attachments are `{ key, name }`, or the legacy `{ url, name }` restricted to this server's uploads. Adds the `cursor` and `beforeId` query parameters.

**Moderation audit (S8)**
- `src/modules/admin/messages/messages.service.ts`: deletes run in one transaction with a `ModerationLog` entry, followed by file cleanup and cursor pagination.
  - The log stores IDs and counts only, never message bodies or tokens.
  - A delete of a missing conversation returns 404 and writes no log.
- `src/modules/admin/messages/messages.controller.ts`: passes the acting admin's ID.
- `src/modules/admin/messages/messages.validators.ts`: `cursor` and `beforeId`.

**Pagination, rate limits, typing (F3, F4, S7)**
- `src/shared/http/cursor.ts` (new): opaque keyset cursor (base64url of `[timestamp, id]`) and the `(ts, id)` "older than" filter.
- `src/shared/chat/pagination.ts` (new): stable orderings and cursor helpers for threads and lists.
- `src/middleware/rateLimit.ts`: per-account limiters.
  - Send: 30 per minute.
  - Upload: 40 per 10 minutes.
  - Signed downloads: 600 per 15 minutes per IP.
- `src/realtime/typingThrottle.ts` (new): per-socket throttle. It runs before the database membership lookup.

**Architecture and payload (P1)**
- `src/shared/chat/helpers.ts` (new): shared chat helpers moved out of the user module. `chatUserSelect` limits participant and sender payloads to `id`, `email`, `role` and display profile fields.
- `src/modules/user/messages/messages.helpers.ts`: now re-exports the shared module, so existing imports keep working.

**Other**
- `.env.example`: documents the new environment variables.

**Tests (new unless noted):**
- `tests/routes.access.test.ts`
- `tests/auth.session-status.test.ts`
- `tests/realtime.sessions.test.ts`
- `tests/uploads.filetype.test.ts`
- `tests/uploads.routes.test.ts`
- `tests/chat.attachments.test.ts`
- `tests/admin-messages.audit.test.ts`
- `tests/chat.pagination.test.ts`
- `tests/chat.ratelimit.test.ts`
- `tests/realtime.typing.test.ts`
- Helpers in `tests/helpers/`.
- `tests/messages.service.test.ts` (modified):
  - The Prisma mock gained `message.findMany` and `message.count` defaults.
  - Two tests added for the single membership check.

### Web (`web/`)

- `src/features/messages/realtime.js`: on `session:expired`, refreshes the session via `AUTH.ME` and reconnects, or stays disconnected.
- `src/config/endpoints.js`, `src/features/messages/messagesApi.js`: upload to `/messages/attachments`; returns `{ key, name, mimeType, size }`.
- `src/modules/messages/utils/attachments.js`: sends `{ key, name }`, or legacy `{ url, name }`.
- `src/modules/messages/utils/hiddenReads.js` (new), `hooks/useChatRealtime.js`: remember reads for the open conversation while the tab is hidden, then mark it read and reconcile the badge when it becomes visible (F1).
- `src/components/data-display/Messenger/threadScroll.js` (new): pure scroll and announcement rules.
- `src/components/data-display/Messenger/Messenger.jsx`:
  - Conditional auto-scroll, the "New messages" button and older-page anchoring (F2).
  - Keyboard-visible message actions with focus rings (A1).
  - `role="log"` thread plus a polite status announcement (A3).
  - File picker limited to the server's types.
  - Uses the shared `isImageAttachment`.
  - Thread state is derived during render, so the layout effect only moves the scroll position.
- `src/modules/dash/admin/messages/components/moderation/MessageItem.jsx`, `ThreadPanel.jsx`: Remove button visible on focus, with a specific label; thread is a `log` region (A2, A3).
- `src/features/messages/pagination.js` (new), `index.js`: `olderMessagesParams` sends `beforeId`; `nextConversationsParams` sends `cursor`.
- `src/modules/messages/hooks/useMessagesContainer.js`, `src/modules/dash/admin/messages/hooks/useChatModeration.js`, `src/features/messages/moderation/adminMessagesThunks.js`: send and forward the new cursors.

**Tests:**
- New:
  - `realtime.session.test.js`
  - `messagesApi.attachments.test.js`
  - `pagination.test.js`
  - `hiddenReads.test.js`
  - `threadScroll.test.js`
- Updated:
  - `Messenger.test.jsx`
  - `attachments.test.js`
  - `MessagesViews.test.jsx`: the assertion now targets the more specific label, and a keyboard test was added.

---

## 3. Role behaviour

| Situation | USER / SUPPLIER | ADMIN |
|---|---|---|
| Active account | Unchanged chat features. | Unchanged moderation features. |
| Suspended or banned | Refresh rejected; sockets disconnected within one sweep, or immediately when suspended through the admin API. Chat and upload routes return 403 immediately (`requireActiveUser`); other routes accept the existing access token for at most 15 minutes. | Same as users, and every `/api/v1/admin/*` and admin users route returns 403 immediately. |
| Attachment links | Signed links for conversations they belong to. A link stops working when the message is deleted or the link expires. | Sees the same signed links in the moderation view. |
| Deleting | Own messages; files removed when no longer referenced. | Any message or conversation; each delete is logged in `ModerationLog`. |
| Rate limits | 30 sends per minute and 40 uploads per 10 minutes, per account. | Same limits; moderation reads and deletes are not limited beyond the global limit. |

No admin hierarchy was added. Admins can still suspend other admins, as before (section 9).

---

## 4. Security improvements and remaining risks

**Improvements:**
- Suspended and banned users lose refresh, sockets and admin access (S1, S3).
- Uploads can no longer carry active content: the type comes from content, the extension from the server, non-images download, and `nosniff` and a sandbox CSP are set (S2).
- New chat attachments are private, served through signed links, membership-scoped, and deleted with their last reference (S4, S5).
- Per-account write limits and a server-side typing throttle (S7).
- Admin deletes are auditable (S8).

**Remaining risks:**
- Admin routers mounted outside `/api/v1/admin` (reports, blogs, ads) don't use `requireActiveUser`. A suspended admin keeps them until their access token expires (15 minutes at most).
- Signed links are bearer links that live 6 to 12 hours. A member removed from a conversation can still use links they already received until those expire.
- Legacy chat attachments uploaded before this change stay in public `/uploads` and remain publicly reachable by URL. Legacy `{ url }` attachments are still accepted, restricted to existing files under this server's `/uploads` with a supported extension, so old clients keep working.
- Files uploaded to the composer but never sent are not swept.
- Macros in legacy (OLE) Office files are not detected. Macro-enabled OOXML is rejected.
- Rate-limit counters and typing throttles live in process memory, which assumes a single API instance. No Redis was added because there is no multi-instance deployment requirement (audit F10).
- Reference counting scans message JSON (`array_contains`) on delete. This is fine at current scale; add an index or an attachments table if delete latency grows.
- Unchanged audit items: F5 (draft lost during send), F6 (realtime ordering), F8 (moderation list not live), F9 (GET thread marks read; the behaviour was kept), F10 (single process), P2 (nested `take: 1`), S9 (socket CORS fallback).

---

## 5. Tests and exact results

### Server: `npx vitest run`

- Result: **23 files, 310 of 310 passed.**
- Baseline before this work: 187 of 187.

| File | Tests |
|---|---|
| `routes.access.test.ts` | 16 |
| `auth.session-status.test.ts` | 7 |
| `realtime.sessions.test.ts` | 6 |
| `uploads.filetype.test.ts` | 36 |
| `uploads.routes.test.ts` | 13 |
| `chat.attachments.test.ts` | 22 |
| `admin-messages.audit.test.ts` | 5 |
| `chat.pagination.test.ts` | 9 |
| `chat.ratelimit.test.ts` | 3 |
| `realtime.typing.test.ts` | 4 |
| `messages.service.test.ts` | 34, including 2 new |

Two fixes to the new tests during the work, neither weakening an assertion:
- The pagination test's expected order was corrected: ties sort by id descending.
- The typing test's user mock lacked an `id`, so the socket never joined the right room. The mock now returns the requested id.

### Web: `npx vitest run`

- Result: **148 files; 984 passed, 1 failed.**
- The failure is `ContactCard.test.jsx` › "uses the same brand cover colour for every member without a cover photo". It is pre-existing and left as an open product decision.
- Baseline before this work: 950 of 951, with the same failure.
- Focused chat runs (Messenger, `features/messages`, `modules/messages`, admin messages): 19 files, 163 of 163 passed.

### Lint and typecheck

- Server `npm run lint`: clean.
  - Lint flagged a control-character regex in `fileType.ts`; it was rewritten without a regex rather than suppressed.
- Server `npx tsc --noEmit`: clean.
- Web `npm run lint`: 12 problems (9 errors, 3 warnings), identical to the baseline.
  - All are in `DataTable.jsx`, `usePaginatedList.js`, `LandingMotion.jsx` and `vite.config.js`, which this work didn't touch.
  - A new `set-state-in-effect` error in the thread scroll hook was fixed by restructuring the hook, not by disabling the rule.

---

## 6. Builds

- Server `npm run build` (`tsc` and `tsc-alias`): passed.
- Web `npm run build` (Vite): passed, built in 5.76 s.

---

## 7. Migrations and deployment

**Database:** no Prisma schema changes and no migrations. `ModerationLog` and its `REMOVE_CONTENT` action already existed.

**New environment variables** (all optional; documented in `server/.env.example`):

| Variable | Default | Purpose |
|---|---|---|
| `MAX_UPLOAD_FILES` | `12` | Most files in one upload request. |
| `PRIVATE_UPLOAD_DIR` | `private-uploads` | Private chat attachment storage. Must be outside `UPLOAD_DIR`. |
| `ATTACHMENT_URL_SECRET` | derived from `JWT_ACCESS_SECRET` | HMAC key for signed links. Set it explicitly so rotating the JWT secret doesn't invalidate links. |
| `ATTACHMENT_URL_TTL_SECONDS` | `21600` | Link lifetime step; links live between one and two steps. |

**Rollout steps:**
1. In Coolify, mount persistent storage for `PRIVATE_UPLOAD_DIR`, as `UPLOAD_DIR` already needs. Otherwise chat attachments are lost on redeploy.
2. Optionally set `ATTACHMENT_URL_SECRET`.
3. Deploy the server before the web app. The server accepts both old and new request shapes:
   - Legacy `{ url }` attachments.
   - `before` without `beforeId`.
   - `page` without `cursor`.
   So old web builds keep working during the rollout.
4. Deploy the web app.
5. If a reverse proxy sits in front of the API, make sure `/chat-attachments/*` is routed to it, like `/uploads/*`.
6. Existing `/uploads/...` URLs keep working; they now carry `nosniff` and the CSP, and non-images download instead of rendering.

**Rollback:** redeploying the previous server is safe. Attachments sent after the upgrade are stored as keys, and the old server would show them without links. Plan any rollback before users send many attachments.

---

## 8. Unverified features

None of the following were executed; no database, accounts or browser session were available.
- Behaviour against real Postgres: `array_contains` reference counting, keyset queries, `ModerationLog` writes. All of these were tested with mocks or an in-memory evaluator.
- Real browser behaviour:
  - Scroll anchoring, the "New messages" button and focus-within reveal.
  - Screen-reader announcements.
  - The hidden-tab `visibilitychange` flow.
  Web tests render statically and test the pure helpers.
- Signed-in end-to-end flows for USER, SUPPLIER and ADMIN.
- The session sweep at its production interval, and behaviour across several server instances.
- Upload behaviour behind the production proxy (body size limits, header pass-through).

---

## 9. Product decisions (not changed)

- Who may start conversations: currently any active user can message any other.
- Whether conversations require a supplier relationship.
- Consent before being added to a group; blocking users.
- Read receipts and a "busy" status in groups.
- Whether members are told that admins can read conversations.
- Retention and soft delete. Admin deletes are still hard deletes, now logged.
- Whether an admin may suspend another admin. This is allowed today, with no hierarchy, and was kept as is.
- The `ContactCard` cover-colour test: the expected behaviour is an open product question, per the user.

---

## 10. Pre-existing failures

- Web test: `ContactCard.test.jsx` (1 test). It was failing before this work and was not changed.
- Web lint: 12 problems in untouched files (section 5).
- Server: none.

---

## 11. Git status (no commit, no push)

Nothing was committed or pushed in either repository.

**Server** (`server/`, HEAD `31bbef0`):
- Modified:
  - `.gitignore`, `.env.example`
  - `src/app.ts`, `src/config/env.ts`, `src/realtime/socket.ts`
  - Middleware: `errorHandler.ts`, `rateLimit.ts`, `upload.ts`
  - Admin: `index.ts`, the four `messages.*` files, `users.routes.ts`, `users.service.ts`
  - `src/modules/auth/auth.service.ts`, `src/modules/uploads/uploads.routes.ts`
  - User messages: `helpers`, `routes`, `service`, `validators`
  - `tests/messages.service.test.ts`
- New:
  - `src/realtime/typingThrottle.ts`, `src/shared/chat/`, `src/shared/files/`, `src/shared/http/cursor.ts`
  - The test files listed in section 5, plus `tests/helpers/`.
- **Pre-existing user changes, untouched:** `docs/API.md`, `src/modules/user/recruitment/recruitment.service.ts`, `src/modules/user/recruitment/recruitment.validators.ts`.

**Web** (`web/`, HEAD `5efe16a`):
- Modified:
  - Messenger: `Messenger.jsx`, `Messenger.test.jsx`
  - `src/config/endpoints.js`
  - Features: `index.js`, `messagesApi.js`, `adminMessagesThunks.js`, `realtime.js`
  - Admin moderation: `MessageItem.jsx`, `ThreadPanel.jsx`, `useChatModeration.js`, `MessagesViews.test.jsx`
  - Messages module: `useChatRealtime.js`, `useMessagesContainer.js`, `attachments.js`, `attachments.test.js`
- New:
  - `threadScroll.js` and its test
  - `pagination.js` and its test
  - `messagesApi.attachments.test.js`, `realtime.session.test.js`
  - `hiddenReads.js` and its test
  - This report.
- `docs/audits/CHAT_FEATURE_AUDIT.md` is untracked from the earlier audit and unchanged.

> **Casing warning before committing the web repo.** Git tracks `src/components/...` (lowercase), but the folder on disk is still `src/Components`.
>
> `git add src/Components/data-display/Messenger/threadScroll.js` would record the uppercase path, which was confirmed with `git add --dry-run`. On the case-sensitive Linux deploy, `Messenger.jsx` would then fail to import it.
>
> Stage the new files with the lowercase path instead (also confirmed with `--dry-run`):
>
> ```
> git add src/components/data-display/Messenger/threadScroll.js src/components/data-display/Messenger/threadScroll.test.js
> ```
>
> Better still, rename the folder on disk to `components` first.
