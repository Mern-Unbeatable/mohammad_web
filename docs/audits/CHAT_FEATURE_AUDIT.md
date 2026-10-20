# Chat Feature Audit — USER, SUPPLIER, ADMIN

Date: 2026-10-20 · Type: read-only audit (no application code, configuration, routes or data changed)

---

## 1. Executive Summary

The chat feature is **one shared implementation** used by all three roles:

- **Backend:** a single REST module (`/api/v1/messages`) plus a Socket.IO layer (`server/src/realtime/socket.ts`). Every per-conversation operation enforces **conversation membership**, regardless of role. ADMIN additionally has a separate **moderation API** (`/api/v1/admin/messages`) that can list and read every conversation on the platform and delete messages or whole conversations.
- **Frontend:** one Redux slice (`features/messages`), one container (`modules/messages`) and one `Messenger` component, mounted under `/chat` (USER), `/supplier/chat` (SUPPLIER) and `/admin/chat` (ADMIN). ADMIN gets a second tab, `/admin/chat/moderation`, with its own slice.

Object-level authorization for regular chat is sound. I traced every per-conversation endpoint and the `typing` socket event, and each one checks membership. Message rendering is safe (no raw HTML, and only `http`/`https` links).

The most important problems:

| # | Severity | Status | Finding |
|---|---|---|---|
| S1 | **High** | Confirmed (code) | Suspended or banned **admins keep full moderation access** (they can read every private conversation and delete content). Three gaps combine: the admin router does not check account status, token refresh does not check account status, and suspending an account does not revoke its refresh tokens. |
| S2 | **High** | Potential (mechanism confirmed in code; exploit not executed) | Uploads trust the MIME type the client declares and keep the client's file extension. Files are then served from the API origin, so an attacker can host active content (HTML or SVG) there and share it as a chat attachment. |
| S3 | Medium | Confirmed (code) | Socket identity is checked only at handshake. Suspended, banned or expired sessions keep receiving live chat events. |
| S4 | Medium | Confirmed (code) | Chat attachments are public files with no access control. Deleting the message or conversation does not delete them. |
| F1 | Medium | Confirmed (code trace) | The unread badge stays stale for the open conversation when messages arrive while the browser tab is hidden. |
| F2 | Medium | Confirmed (code) | The thread jumps to the bottom on every new message, even while the user is reading older history. |
| A1 | Medium | Confirmed (code) | Copy, Edit and Delete message actions cannot be reached by keyboard. |

Checks executed: backend chat unit tests (**55/55 pass**) and frontend chat tests (**157/157 pass**).

I did no browser or end-to-end verification. You confirmed that no backend or test accounts are available, so every UI or responsive behaviour below comes from reading the code.

---

## 2. Scope and Evidence

**In scope:**

- **Backend:**
  - `server/src/modules/user/messages/*`, the shared chat API for all roles.
  - `server/src/modules/admin/messages/*`.
  - `server/src/realtime/socket.ts`.
  - The upload middleware and module.
  - The auth middleware (`authenticate`, `authorize`, `requireActiveUser`, `rateLimit`).
  - `app.ts`, `routes/index.ts`.
  - The Prisma models `Conversation`, `ConversationParticipant`, `Message` and their 5 chat migrations.
  - The auth refresh flow and admin user status changes, as far as they affect chat.
- **Frontend:**
  - `web/src/features/messages/**` (API, slice, thunks, realtime, mappers).
  - `web/src/features/messages/moderation/**`.
  - `web/src/modules/messages/**` (container, hooks, routes, utils).
  - `web/src/modules/dash/{user,supplier,admin}/messages/**`.
  - `web/src/components/data-display/Messenger/**`.
  - `web/src/components/modals/messages/**`.
  - `web/src/shared/router/routes/{chat,user,supplier,admin}.routes.jsx`.
  - The navigation badge and preview hooks.

**Evidence types:**

- **Confirmed (code):** read and traced in source; the behaviour follows deterministically from the code.
- **Confirmed (test):** exercised by a test that passed in this audit.
- **Potential:** a plausible risk that needs runtime testing, load testing or deployment knowledge to confirm.
- **Not verified:** no evidence either way.

**Not used:**

- No running backend or database, and no test accounts (you confirmed this).
- No browser sessions.
- No production data.

---

## 3. Chat Architecture and Data Flow

```
Role view (MessagesView / SupplierMessagesView / AdminChatInboxView)
  └─ ChatLayout (route/ChatLayout.jsx)  ← useChatRoute: basePath, section, targetId from the URL
       └─ MessagesContainer → useMessagesContainer
            ├─ Redux: features/messages/messagesSlice (+ thunks → messagesApi → /api/v1/messages)
            ├─ useChatRealtime → useMessagesSocket (singleton socket.io client, realtime.js)
            ├─ useTypingIndicators / useTypingEmitter
            ├─ useOpenConversationFromUrl / useOpenNewestOnDesktop / useListingDraft
            └─ MessagesPageContent (+ useMessengerDrafts, useMobileChatLayout) → Messenger.jsx

Admin moderation: AdminChatView (tabs) → AdminChatModerationView → useChatModeration
  → features/messages/moderation/adminMessagesSlice → /api/v1/admin/messages
```

### URL model

- `chatPaths.js` defines the base path per role: `/chat`, `/supplier/chat` and `/admin/chat`.
- Direct chats are addressed by the **other user's id**: `…/messages/:userId`.
- Groups are addressed by **conversation id**: `…/group/:groupId`.
- `?listing=<id>` preloads a marketplace listing into the composer.
- `buildChatRoute` (`shared/router/routes/chat.routes.jsx`) is shared by all three roles.
- `toRoleChatPath` redirects a user who opens another role's chat URL to their own base path.

### HTTP API (`server/src/modules/user/messages/messages.routes.ts`, mounted at `/api/v1/messages`)

All routes run `authenticate` and `requireActiveUser`. There is **no role restriction**: USER, SUPPLIER and ADMIN use it identically.

| Endpoint | Service | Authorization |
|---|---|---|
| `GET /` | `listConversations` | Only conversations where the caller is a participant |
| `GET /recipients` | `listRecipients` | Any active user (directory of all active users) |
| `GET /unread` | `unreadSummary` | Caller's own participations |
| `GET /direct/:userId` | `findDirect` | Filters on `participants.some.userId = caller` |
| `POST /direct` | `startDirect` | Recipient must be active; listing must be shareable |
| `POST /group` | `createGroup` | Members must exist and be active |
| `GET /:id` | `getConversation` | `assertMembership` |
| `PATCH /:id` | `renameGroup` | `assertGroupOwner` |
| `GET /:id/messages` | `getMessages` | `assertMembership`; latest page **marks the conversation read** |
| `POST /:id/messages` | `sendMessage` | `assertMembership` |
| `PATCH /:id/messages/:messageId` | `editMessage` | Membership, sender only, not SYSTEM |
| `DELETE /:id/messages/:messageId` | `deleteMessage` | Membership, sender only, not SYSTEM |
| `POST /:id/read` | `markRead` | `assertMembership` |
| `POST /:id/participants` | `addParticipants` | Group owner |
| `DELETE /:id/participants/:userId` | `removeParticipant` | Group owner |
| `DELETE /:id/leave` | `leave` | Membership |

### Admin moderation API (`server/src/modules/admin/messages/*`, mounted at `/api/v1/admin/messages`)

These routes run `authenticate` and `authorize(Role.ADMIN)`, but **not `requireActiveUser`**.

| Endpoint | Behaviour |
|---|---|
| `GET /` | Lists and searches all conversations, with participants and message count |
| `GET /:id` | Any conversation |
| `GET /:id/messages` | Any thread, cursor-paginated; does **not** mark it read |
| `DELETE /:id/messages/:messageId` | Hard-deletes any message (including SYSTEM); emits `message:deleted` |
| `DELETE /:id` | Hard-deletes a conversation (messages cascade); emits `conversation:removed` |

There is no admin endpoint to post into other people's conversations.

### Realtime (`server/src/realtime/socket.ts`)

- **Handshake:** the JWT is verified, the user is loaded, and the account must be `ACTIVE`. The socket then joins the room `user:<id>`.
- **Delivery:** all server events go to per-user rooms through `emitToUsers(participantIds, …)`, which the services call after each write:
  - `message:new`, `message:updated`, `message:deleted`;
  - `conversation:new`, `conversation:updated`, `conversation:removed`, `conversation:read`;
  - `presence:update`;
  - `typing`;
  - `notification:new`.
- **Client-to-server events:**
  - `typing`: checks membership in the database, then relays to the other members.
  - `presence:query`: answers only for users who share a conversation with the caller, capped at 500 ids.
- **Scaling limit:** presence counts and the Socket.IO adapter live in memory, in one process. The code comments acknowledge this.

### Data model (`server/prisma/schema.prisma`)

- **`Conversation`** (`isGroup`, `name`, `directKey @unique`, `@@index([updatedAt])`):
  - `directKey` is the two user ids, sorted and joined. It guarantees at most one active 1:1 thread per pair.
  - It is set to `null` when someone leaves a direct chat.
- **`ConversationParticipant`** (`role` OWNER/MEMBER, `lastReadAt`, `@@unique([conversationId, userId])`, `@@index([userId])`):
  - `lastReadAt` drives both unread counts and the "Seen" receipt.
- **`Message`** (`body`, `attachments Json`, `listingId?`, `type` TEXT/SYSTEM, `event Json?`, `editedAt?`, `@@index([conversationId, createdAt])`, `@@index([listingId])`):
  - The sender relation has `onDelete: Cascade`.

### Unread state

- **Server:** counts TEXT messages from others with `createdAt > lastReadAt`, using raw SQL (`unreadCountsFor`, `unreadTotalsFor`).
- **Client:** keeps a per-conversation `unreadCount` and the account totals in `state.messages.unread`.
- **Nav badge:** `useUnreadMessages` re-fetches totals on route change, when the tab becomes visible, and on socket events.
- **Notifications:** chat messages deliberately create **no** notifications. This is covered by the test "delivers messages without creating notifications".

---

## 4. USER Chat Audit

- **Routes and UI:**
  - `/chat` comes from `buildChatRoute` in `user.routes.jsx`. It renders `MessagesView`, which mounts `<ChatLayout variant="dashboard" />`.
  - The legacy path `/messages` redirects to `/chat`.
- **Layout:** `MessagesPageContent`, dashboard variant.
  - Below `xl`, the messenger is a `fixed` full-viewport layer under the dashboard header.
  - `useMobileChatLayout` locks scroll on both `<body>` and `<html>`, and hides the bottom nav while a chat is open.
  - At `xl` and above it is inline, with height `calc(100dvh-200px)`.
- **Conversation list:** `GET /messages?type=direct|group&search&page` (30 per page, "load more" button). The list is ordered by `updatedAt desc` and split into **Messages** and **Groups** tabs.
- **Starting conversations:**
  - The New Message modal searches `GET /messages/recipients`, which returns every other active user, then calls `POST /messages/direct`.
  - Other entry points:
    - Contact profile "Message" button: `ContactProfileView`, `useContactProfile`.
    - Marketplace "Contact seller": `useListingDetail` sends `listingId` along with the message.
  - The server reuses the pair's existing thread through `directKey`. If two "start" requests race, the duplicate-key error `P2002` is handled.
- **Sending and receiving:**
  - Sending posts to `POST /messages/:id/messages`. The client adds the message from the response and from `message:new`, ignoring any message whose id it already has.
  - A single `sending` flag blocks double submits.
  - There is no optimistic insert and no retry. When a send fails, the draft and attachments are kept.
- **History:** `GET /:id/messages?before=<createdAt>&pageSize=30`, loaded with a "Load older messages" button. Prepending older pages keeps the scroll position stable.
- **Unread and read state:**
  - The nav badge and the per-conversation counts are both implemented.
  - The "Seen" receipt is **direct chats only** (`isSeenByOther`).
  - Opening the latest page of a thread marks it read on the server.
- **Online status:** online/offline only, and only for conversation partners. There is **no "busy" status**.
- **Typing:**
  - The client re-sends "typing" at most every 3 s and sends "stopped" after 4 s without a keystroke.
  - The receiver clears the indicator after 6 s if "stopped" never arrives.
- **Message features:**
  - Attachments: up to 10 per message, uploaded first through `POST /uploads`. Images render inline; other files render as download links.
  - Text formatting: bold, italic, strikethrough, code and lists.
  - Edit and delete apply to your own TEXT messages only.
  - Groups: create, rename, add or remove members (owner only), leave.
- **Errors:** slice errors are shown as toasts. When a conversation you have open is removed, you get the toast "This conversation is no longer available" and are sent back to the list.
- **Authorization:** membership is enforced on the server for every per-conversation call. Changing the `:userId` or `:groupId` in the URL of a conversation you're not in returns 403, or 404 for a missing direct thread, which opens the composer instead.

Findings that affect USER: F1, F2, F3–F7, A1, A3, S2–S7.

---

## 5. SUPPLIER Chat Audit

- **Routes and UI:**
  - `/supplier/chat` comes from `buildChatRoute` in `supplier.routes.jsx`, with legacy `messages` redirecting there.
  - `SupplierMessagesView` renders `<ChatLayout variant="panel" />` inside the panel layout. On mobile it does **not** lock page scroll or hide the bottom nav.
- **API and permissions:** **identical to USER.**
  - Same endpoints, same membership checks, same directory of recipients.
  - Suppliers can only reach conversations they participate in. The membership check on every per-conversation endpoint applies to all roles.
- **Customer-to-supplier conversations:**
  - No business relationship is required. Any active user can start a direct chat with a supplier, and a supplier can start one with any active user (`listRecipients` comment: "every other active user").
  - Listing cards inside supplier chats are **not links**, because suppliers have no marketplace pages. `marketplaceListingPath` returns `null` for SUPPLIER, and the code comment marks this as intentional.
  - Profile links point to `/supplier/contacts/:id`.
- **Badges and notifications:**
  - The unread badge comes from `PanelLayout` through `useUnreadMessages`.
  - Notification links resolve to `/supplier/chat` (`SupplierNotificationsView`).
- **Differences from USER:**
  - Panel layout instead of dashboard layout.
  - Non-clickable listing cards.
  - Different profile path.
  - All of these are explicit in code and look intentional.
- **Not implemented:** there is no supplier-specific restriction such as "only customers who enquired". Whether that is desired is a **product decision**.

---

## 6. ADMIN Chat Audit

- **Routes:**
  - `/admin/chat` renders `AdminChatView`, a shell with two tabs:
    - **Inbox:** `AdminChatInboxView`, the same `ChatLayout` in the panel variant.
    - **Moderation:** `/admin/chat/moderation`, rendered by `AdminChatModerationView`.
  - The whole `/admin` tree is wrapped in `RequireRole allowedRoles={[ADMIN]}`.
- **Regular private conversations: yes.** Admins use the same `/api/v1/messages` API as everyone else, with the same membership rules.
  - They can be messaged by anyone, because recipients include admins.
  - They can start chats from the user detail page (`useAdminUserDetail`) and the listing detail page (`useAdminListingDetail`).
  - Through this API an admin **cannot** read conversations they are not in.
- **Administrative access to other users' conversations: yes, explicitly implemented and authorized.** It lives in `server/src/modules/admin/messages/messages.service.ts` and is guarded by `authorize(Role.ADMIN)`. Admins can:
  - List and search every conversation, including participants and message counts.
  - Read any thread. Moderation reads do **not** update `lastReadAt`, so participants are not told.
  - Hard-delete any message, including SYSTEM activity notices, which group members themselves cannot delete.
  - Hard-delete any conversation.
  - Admins **cannot** send into, edit messages in, or change membership of conversations they are not part of.
- **Is the broader access intentional?** Yes. The UI subtitle reads "Message members and moderate platform conversations", and the module docs describe it (`modules/dash/admin/messages/doc/STRUCTURE.md`).
- **Backend enforcement:**
  - The role check is enforced.
  - The **account status check is not** (see S1).
  - Moderation actions are **not audited** (see S8).
- **Moderation UI:**
  - Debounced search, a type filter, "load more", load older messages, and confirmation modals for removal.
  - The list is not live: it only updates when you re-search or reload.

---

## 7. Cross-Role Feature Comparison

| Feature | USER | SUPPLIER | ADMIN | Evidence / Notes |
|---|---|---|---|---|
| Chat routes and UI | Implemented | Implemented | Implemented | `buildChatRoute` for each role. ADMIN adds a `moderation` tab. |
| Conversation list | Implemented | Implemented | Implemented | Same `GET /messages`. ADMIN also has the platform-wide moderation list. |
| Send/receive messages | Implemented | Implemented | Implemented | Same API. ADMIN cannot post into conversations it is not a member of (by design). |
| Real-time updates | Implemented | Implemented | Partially implemented | Inbox is realtime for all roles. The moderation view has no socket handling. |
| Unread/read status | Implemented | Implemented | Implemented (inbox) | Badge and per-conversation counts. "Seen" only in direct chats; no group read receipts. See F1. |
| Online/busy status | Partially implemented | Partially implemented | Partially implemented | Online/offline for conversation partners only. No "busy" state. In-memory, single process. |
| Typing indicators | Implemented | Implemented | Implemented (inbox) | Socket `typing` with a membership check; client throttles. |
| Attachments | Implemented | Implemented | Implemented | Up to 10 files, 50 MB each (server default). Moderation view lists them as links. See S2, S4, S5. |
| Pagination/history | Implemented | Implemented | Implemented | Cursor on `createdAt`; "load older" button (no infinite scroll). See F3, F4. |
| Permissions | Implemented | Implemented | Implemented, with gap | Membership enforced everywhere. Admin moderation lacks the account status check (S1). |
| Error/loading states | Implemented | Implemented | Implemented | Toasts, spinners, skeletons, empty state "No messages yet. Say hello!". No send retry. |
| Mobile responsiveness | Not verified | Not verified | Not verified | Code: USER is a fixed full-viewport layer below `xl`; SUPPLIER and ADMIN use the panel fill layout. Not inspected in a browser. |

---

## 8. Frontend Findings

### F1 — Unread badge stays stale for the open conversation after a hidden-tab period

- **Severity:** Medium
- **Roles:** All
- **Status:** Confirmed (code trace; not reproduced in a browser)
- **Where:**
  - `web/src/modules/messages/hooks/useChatRealtime.js`, the `message:new` handler.
  - `web/src/features/messages/useUnreadMessages.js`.
  - `web/src/features/messages/messagesSlice.js` (`messageReceived`).
- **Evidence:**
  - `markConversationRead` is only dispatched when `document.visibilityState === 'visible'` at the moment the message arrives.
  - `messageReceived` does not count messages for the active conversation, so the local count stays 0.
  - `useUnreadMessages` re-fetches the server totals on `message:new` and again when the tab becomes visible. The server still counts those messages as unread.
  - Nothing marks the active conversation read when the tab becomes visible.
- **Reproduction:**
  1. Open a conversation.
  2. Switch to another browser tab.
  3. Have the other participant send a message.
  4. Return to the tab.
- **Impact:**
  - The nav badge shows unread messages for the conversation already on screen, while the list row shows none.
  - It stays wrong until the user opens another conversation and comes back, or reloads.
  - Other devices also keep seeing the messages as unread.
- **Fix:** on `visibilitychange` to `visible`, dispatch `markConversationRead(activeConversationId)` if a conversation is open.

### F2 — Thread jumps to the bottom on every new message

- **Severity:** Medium (UX)
- **Roles:** All (inbox)
- **Status:** Confirmed (code)
- **Where:** `web/src/components/data-display/Messenger/Messenger.jsx`, `useThreadScroll`.
- **Evidence:** whenever the last message id changes (`prev.lastId !== lastId`), the hook sets `el.scrollTop = el.scrollHeight`, whatever the current scroll position.
- **Impact:** a user reading older history is pulled to the bottom whenever anyone posts.
- **Fix:**
  - Auto-scroll only when the user is already near the bottom, or when the new message is their own.
  - Otherwise show a "New messages" pill.

### F5 — Text typed while a send is in flight is discarded

- **Severity:** Low
- **Status:** Confirmed (code)
- **Where:** `web/src/modules/messages/hooks/useMessengerDrafts.js`, `handleSend`.
- **Evidence:** the draft is cleared (`''`) after `await onSend` resolves, which overwrites any text typed in the meantime.
- **Fix:** clear only if the draft is unchanged, or clear optimistically and restore it on failure.

### F6 — Realtime messages are appended, not ordered

- **Severity:** Low
- **Status:** Confirmed (code)
- **Where:** `messagesSlice.js`, `appendMessage`.
- **Evidence:** the message is pushed to the end of the list without being placed by `time`.
- **Impact:** near-simultaneous messages from different senders can show in a different order than after a reload.
- **Fix:** insert in `createdAt` order, using id as a tie-break.

### F7 — Orphaned uploads

- **Severity:** Low
- **Status:** Confirmed (code)
- **Where:**
  - `useMessengerDrafts.js`: removing a pending attachment.
  - Server `deleteMessage`, admin `deleteMessage` / `deleteConversation`.
- **Evidence:** files are uploaded the moment they're picked. Removing them from the composer, or deleting the message or conversation later, never deletes the stored file.
- **Fix:** track uploads in the database, with owner and status, and run cleanup.

### F8 — Moderation view: prepended pages are not de-duplicated, and the list is not live

- **Severity:** Low
- **Roles:** ADMIN
- **Status:** Confirmed (code)
- **Where:** `web/src/features/messages/moderation/adminMessagesSlice.js` (`fetchModerationThread.fulfilled`) and `useChatModeration.js`.
- **Evidence:** older pages are prepended without the id de-duplication the inbox slice uses, and the moderation view has no socket handling.

### A1 — Message actions are not reachable by keyboard

- **Severity:** Medium (accessibility)
- **Status:** Confirmed (code)
- **Where:** `Messenger.jsx`, `MessageBubble`. Own messages have Copy, Edit and Delete; other people's messages have Copy.
- **Evidence:** the action container is `hidden … group-hover:flex [@media(hover:none)]:flex`. On a desktop with a mouse it is `display:none` unless hovered, so keyboard users can never focus it. Touch devices are covered by the `hover:none` rule.
- **Fix:** add `group-focus-within:flex`, and make the bubble focusable or expose the actions through a menu button.

### A2 — Moderation "Remove message" button is invisible on keyboard focus

- **Severity:** Low (accessibility)
- **Roles:** ADMIN
- **Status:** Confirmed (code)
- **Where:** `web/src/modules/dash/admin/messages/components/moderation/MessageItem.jsx`.
- **Evidence:** the button is `opacity-0 … group-hover:opacity-100` with no `focus-visible:opacity-100`.

### A3 — New messages are not announced to screen readers

- **Severity:** Low (accessibility)
- **Status:** Confirmed (code)
- **Where:** `Messenger.jsx`, the thread container.
- **Evidence:** the container has no `role="log"` or `aria-live`. The typing indicator does use `aria-live="polite"`.

### Architecture and consistency (improvement opportunities, not bugs)

- **Good:** a single messenger, slice and API for all roles. Role differences are limited to the base path, layout variant, and the profile and marketplace link maps.
- **Duplicated logic:**
  - Image detection is implemented twice: `Messenger.jsx` has a local `isImage`, and `features/messages/messagesMappers.js` has `isImageAttachment`.
  - Attachment rendering is duplicated between `AttachmentList` in `Messenger.jsx` and the moderation `MessageItem`.
  - Thread pagination logic is duplicated between `messagesSlice` and `adminMessagesSlice`.
- **Server dependency direction:** `admin/messages/messages.service.ts` imports helpers from `modules/user/messages/messages.helpers`. Shared chat helpers belong in a shared module.
- **Folder casing:** Git now tracks only `src/components/...`; that fix is committed. The folder on disk is still named `src/Components` and should be renamed to match.
- **`Messenger.jsx` size:** about 960 lines, containing the list, thread, composer, bubbles and the scroll hook. It's a candidate for splitting, but that's not a bug.

### Behaviour verified as correct (code)

- Socket listeners are removed on unmount. The socket is shared with a reference count and a 1 s grace period, so Strict Mode doesn't reconnect.
- Typing timers are cleared on unmount.
- Out-of-date recipient searches and conversation-list responses for a tab the user already left are ignored.
- Per-conversation drafts and pending attachments survive switching chats.
- Older pages keep the scroll position stable when prepended.
- While the socket is disconnected, the visible data refreshes every 20 s, and again on reconnect.
- The mobile scroll lock goes through the reference-counted `useBodyScrollLock` (already covered by tests from the layout work).

---

## 9. Backend and API Findings

### F3 — The history cursor can skip messages that share a timestamp

- **Severity:** Low
- **Roles:** All, including moderation
- **Status:** Potential
- **Where:** `messagesService.getMessages` and `adminMessagesService.getMessages`, both using `createdAt: { lt: before }`. The client passes `messages[0].time` as the cursor.
- **Impact:** if several messages share the boundary millisecond, the ones not on the current page are never loaded.
- **Fix:** use a compound cursor `(createdAt, id)`.

### F4 — Conversation list uses offset pagination over a moving order

- **Severity:** Low
- **Status:** Potential
- **Where:** `listConversations` (user and admin), using `orderBy updatedAt desc` with `skip`/`take`.
- **Impact:** new activity between page loads shifts rows, so "load more" can skip conversations. The client removes duplicates but cannot recover skipped rows.
- **Fix:** use a cursor on `(updatedAt, id)`.

### F9 — `GET /:id/messages` has write side effects

- **Severity:** Informational
- **Status:** Confirmed (code)
- **Detail:** loading the latest page updates `lastReadAt` and sends `conversation:read` to all participants. Prefetching or retrying a GET marks the conversation as read. The admin equivalent correctly has no such side effect.

### F10 — Presence and realtime delivery are single-process

- **Severity:** Low now; High if scaled out
- **Status:** Potential (deployment-dependent)
- **Where:** `socket.ts` (`connectionCounts`, the default in-memory adapter).
- **Impact:** with more than one API instance, events and presence only reach sockets on the same instance.
- **Fix:** use `@socket.io/redis-adapter` and shared presence before scaling horizontally.

### Validation (verified)

- **Zod schemas** (`messages.validators.ts`):
  - UUID params.
  - Body trimmed, at most 5000 characters.
  - At most 10 attachments, each with `url` ≤ 2000, `name` ≤ 255 and `mimeType` ≤ 150.
  - Group name 1–160 characters; at most 256 participants per request.
  - Page size ≤ 100.
- **JSON body limit:** 2 MB.
- **Covered by passing tests:** an empty message is rejected, and an attachment hosted elsewhere is rejected.

### Group membership and concurrency (verified)

- Creating the direct thread is race-safe through `directKey @unique` and the `P2002` fallback.
- Participant inserts use `skipDuplicates`.
- Ownership passes to the oldest remaining member when the owner leaves.
- The conversation is deleted when its last member leaves.

---

## 10. Security and Authorization Findings

### S1 — Suspended or banned admins keep chat moderation access

- **Severity:** High
- **Roles:** ADMIN
- **Status:** Confirmed (code; not executed)
- **Where:**
  - `server/src/modules/admin/messages/messages.routes.ts`: `router.use(authenticate, authorize(Role.ADMIN))`, with **no `requireActiveUser`**. The `/admin` router index doesn't add one either.
  - `server/src/modules/auth/auth.service.ts`, `refresh()`: checks only that the token exists and the user exists, **not `user.status`**, then issues new tokens.
  - `server/src/modules/admin/users/users.service.ts`, `updateStatus()`: sets SUSPENDED or BANNED but **does not revoke refresh tokens**. Revocation happens on password reset only.
  - Nothing in `updateStatus` stops an admin from suspending another admin.
- **Reproduction (needs a test environment):**
  1. Admin A is signed in.
  2. Admin B suspends A.
  3. A calls `GET /api/v1/admin/messages` and `GET /api/v1/admin/messages/:id/messages`.
  4. The calls keep succeeding, including after the 15-minute access token expires, because refresh keeps issuing new tokens.
- **Impact:** a removed admin keeps the ability to read every private conversation and delete content.
- **Fix:**
  - Add `requireActiveUser` to the admin routers.
  - Reject non-ACTIVE users in `refresh()`.
  - Revoke refresh tokens, and disconnect sockets, on suspend or ban.
- **Related:** `POST /api/v1/uploads` also lacks `requireActiveUser`, so suspended users can still upload files, though they cannot send messages.

### S2 — Uploads trust the client's MIME type and keep the client's extension

- **Severity:** High
- **Roles:** All (chat attachments)
- **Status:** Potential. The mechanism is confirmed in code; no exploit was executed and the deployment topology is unknown.
- **Where:**
  - `server/src/middleware/upload.ts`:
    - `fileFilter` checks `file.mimetype`, which multer takes from the Content-Type the client declared for that part of the upload.
    - `filename` keeps `path.extname(file.originalname)`.
  - `server/src/app.ts`: `express.static` serves `/uploads` from the API origin, with the Content-Type chosen by file extension.
- **How it plays out:**
  - A file named `x.html` or `x.svg`, sent with the declared type `image/png`, passes the filter. It is stored with its `.html`/`.svg` extension and served as `text/html` / `image/svg+xml`.
  - Chat attachment links open in a new tab (`target="_blank"`), so the victim lands on that page on the API origin.
  - Helmet's default CSP (`script-src 'self'`) does not block a script uploaded the same way and loaded from the same origin.
- **Impact:**
  - At minimum, active content is hosted on the platform's own domain (phishing).
  - Web tokens are kept in the web origin's storage, so whether this becomes account takeover depends on whether the web app and API share an origin.
- **Fix:**
  - Choose the extension from the **validated** type, after checking the file's actual content (magic bytes).
  - Keep an allowlist of extensions.
  - Serve non-images with `Content-Disposition: attachment`.
  - Add `Content-Security-Policy: sandbox` for `/uploads`, or serve uploads from a separate domain.
- **Evidence needed:** in a test environment, upload a crafted file and confirm the response's `Content-Type` and whether the browser executes it.

### S3 — Socket sessions are not re-validated

- **Severity:** Medium
- **Roles:** All
- **Status:** Confirmed (code)
- **Where:** `server/src/realtime/socket.ts`, `io.use` (runs at handshake only).
- **Evidence:** status and token are checked once. An open socket keeps getting `message:new`, `typing` and `presence:update` after:
  - the account is suspended or banned;
  - the access token expires;
  - the server-side refresh tokens are revoked.
- **Fix:**
  - On a status change, call `io.in(userRoom(id)).disconnectSockets(true)`.
  - Optionally re-check the token's expiry periodically.

### S4 — Chat attachments are publicly accessible and never deleted

- **Severity:** Medium
- **Roles:** All
- **Status:** Confirmed (code)
- **Where:** `app.ts` serves `/uploads` with no authentication; `upload.ts` builds the filename.
- **Evidence:**
  - Anyone with the URL can download a file, whether or not they're in the conversation. The filename is a timestamp plus 8 random bytes, so it is hard to guess, but URLs leak through history, logs and forwarding.
  - Files outlive message deletion and conversation deletion (F7).
- **Fix:** an authenticated download endpoint that checks membership, or short-lived signed URLs, plus deleting files with their messages.

### S5 — Attachment references are not bound to the uploader

- **Severity:** Low
- **Roles:** All
- **Status:** Confirmed (code)
- **Where:** `attachmentSchema` and `isOwnUploadUrl` in `messages.validators.ts` / `messages.helpers.ts`.
- **Evidence:**
  - Any URL beginning with `${PUBLIC_URL}/uploads/` is accepted. That includes other users' files and path-traversal-style URLs (`/uploads/../…`) that browsers resolve elsewhere on the API origin.
  - `name`, `mimeType` and `size` come from the client and are not checked against the stored file. The client renders an `<img>` when `mimeType` starts with `image/`.
- **Fix:** reference uploads by a server-side id owned by the sender.

### S6 — Directory exposure and unsolicited contact

- **Severity:** Low (product decision)
- **Roles:** All
- **Status:** Confirmed (code)
- **Where:** `messagesService.listRecipients`, `createGroup`, `addParticipants`; `displayNameOf` in `messages.helpers.ts`.
- **Evidence:**
  - Any authenticated active user can list **every** active user, with name, avatar, title, company and role.
  - The display name falls back to the **email address** when the profile has no name.
  - Any user can open a direct chat with anyone, admins included, or add up to 256 users to a group without their consent.
  - There is no block or mute function.
- **Fix (if desired):**
  - Never fall back to the email address.
  - Consider limiting recipients to connections, or adding block/report-in-chat and consent before being added to a group.

### S7 — Abuse prevention relies on one global IP limiter

- **Severity:** Low
- **Roles:** All
- **Status:** Potential
- **Where:** `app.ts` / `middleware/rateLimit.ts` (default 300 requests per 15 minutes per IP, across the whole API); `socket.ts` `typing` handler.
- **Evidence:**
  - There are no per-user limits on sending, creating groups or starting chats.
  - The `typing` socket handler queries the database on every event, with no server-side throttle.
  - The opposite risk also exists. Each incoming message in the open chat triggers a mark-read POST, an unread-summary GET and, for edits and deletes, a conversation GET. Active users behind one office IP (with `trust proxy 1`) could hit HTTP 429.
- **Fix:** per-user limits on write endpoints and socket events, and a higher-capacity limiter for read endpoints.
- **Evidence needed:** a load test.

### S8 — Admin moderation actions are not audited

- **Severity:** Low
- **Roles:** ADMIN
- **Status:** Confirmed (code)
- **Where:** `adminMessagesService.deleteMessage` / `deleteConversation`.
- **Evidence:**
  - Neither writes to `ModerationLog`, unlike `adminUsersService.updateStatus`.
  - Deletes are hard deletes, so no evidence remains.
  - Admin reads of private threads are not logged either.
- **Fix:** log moderation deletes, and possibly reads, with actor, target and reason; consider soft delete.

### S9 — Socket CORS falls back to "any origin"

- **Severity:** Informational
- **Status:** Confirmed (code)
- **Detail:** when `CORS_ORIGINS` is unset, `origin: true`. Authentication is by token, not cookie, so the risk is low. Production should set `CORS_ORIGINS` explicitly.

### Verified as secure (code; partly covered by passing tests)

- **Object-level authorization (IDOR/BOLA):**
  - `getConversation`, `getMessages`, `markRead`, `sendMessage`, `editMessage`, `deleteMessage`, `leave` and the group owner actions all call `assertMembership` or `assertGroupOwner` first.
  - Changing a conversation id in a request returns **403** for non-members.
  - `findDirect` is scoped to the caller.
  - Edits and deletes also check that the message belongs to the conversation (`findFirst({ id: messageId, conversationId })`).
- **Senders:** `senderId` always comes from the authenticated user, never from the request body.
- **WebSocket rooms:**
  - Clients cannot join arbitrary rooms; they are joined only to `user:<own id>`.
  - `typing` relays only after checking membership.
  - `presence:query` is limited to conversation partners.
- **Rendering:**
  - No `dangerouslySetInnerHTML`.
  - `FormattedMessage` produces React elements, and links are limited to `http`/`https`, with `rel="noopener noreferrer nofollow"`.
  - SYSTEM notices are rendered as text.
- **Role separation:** the moderation API requires ADMIN on the backend, as well as the frontend `RequireRole`.

---

## 11. Database and Performance Findings

### P1 — Conversation payloads include every participant

- **Severity:** Low
- **Status:** Confirmed (code)
- **Where:** `conversationInclude` (participants with user and profile), used by `listConversations` and the admin moderation list.
- **Impact:** a page of 30 conversations returns every member of every group (groups can grow past 256), and `serializeConversation` serializes all of them. Payload size and serialization cost grow with group size.
- **Fix:** return a small participant preview plus a count in the list. Load full membership only in the detail view.

### P2 — Fetching "last message per conversation" through a nested `take: 1`

- **Severity:** Low
- **Status:** Not verified
- **Where:** `conversationInclude.messages: { orderBy: { createdAt: 'desc' }, take: 1 }`.
- **Detail:** depending on the Prisma version, a nested `take` on a one-to-many relation across many parent rows may be applied after fetching, rather than per parent in SQL.
- **Evidence needed:** turn on Prisma query logging and inspect the generated SQL. If confirmed, use a lateral join or denormalize `lastMessageId` onto `Conversation`.

### P3 — Chatty read and unread traffic

- **Severity:** Low
- **Status:** Confirmed (code)
- **Evidence:** every received message in the open chat triggers:
  - `POST /:id/read`, which emits `conversation:read` to all N group members;
  - `GET /unread`, debounced by 400 ms.
- **Fix:** batch or throttle mark-read calls, for example once per second while focused.

### Indexes (verified)

- `Message(conversationId, createdAt)` supports thread paging and the unread joins.
- `ConversationParticipant @@unique(conversationId, userId)` supports the membership lookups; `@@index(userId)` supports the conversation list.
- `Conversation(updatedAt)` supports list ordering.
- No missing index was identified for chat queries. There are no N+1 loops in the services; the per-conversation unread counts come from one grouped query.

### Data integrity (informational)

- **Deleting a user cascades:** `Message.sender` and `ConversationParticipant.user` both have `onDelete: Cascade`, so deleting a user deletes every message they sent in other people's threads.
- **Hard deletes:** both user and admin deletes are hard deletes, with no tombstone ("This message was deleted").
- **Clock sources:** `lastReadAt` is set with the application server's clock (`new Date()`), while `createdAt` comes from the database default. Clock skew could flip "Seen" or unread results for messages sent within the skew window. This is **Potential**.

---

## 12. Existing Test Coverage and Verification Results

### Executed in this audit

| Suite | Command | Result |
|---|---|---|
| Backend chat (mocked Prisma and socket; dummy database URL, no network) | `server`: `npx vitest run tests/messages` | **3 files, 55/55 passed** (`messages.helpers` 16, `messages.validators` 7, `messages.service` 32) |
| Frontend chat | `web`: `npx vitest run` on the 18 chat test files (`features/messages`, `modules/messages`, `modules/dash/admin/messages`, `Messenger`, message modals, `chat.routes`) | **18 files, 157/157 passed** |

### What existing tests cover

- **Backend:**
  - Non-members cannot send.
  - Only the sender can edit or delete, and non-members cannot edit.
  - SYSTEM notices are immutable.
  - Owner-only group management; no management of direct chats.
  - Leave and ownership handover.
  - Group activity notices.
  - Starting chats with users you're not connected to.
  - Recipient search.
  - Validators: empty message, foreign attachment URL, UUID recipient.
  - Helpers: `directKey`, role chat paths, serializers.
- **Frontend:**
  - Slice reducers: realtime append, de-duplication, unread maths, edits.
  - Mappers and "Seen"; message formatting and safe links; composer formatting.
  - Chat routes and role redirects; legacy links.
  - The `Messenger` render, recipient picker and modals.
  - Moderation utilities and admin views.

### Missing coverage

- **Backend authorization:**
  - No tests at all for `adminMessagesService` or its routes.
  - No route-level tests proving `authorize(ADMIN)` or `requireActiveUser` are wired.
  - No test that non-members get 403 from `getConversation`, `getMessages` or `markRead`.
  - No test for the suspended-admin case (S1).
- **Realtime:** no tests for `socket.ts` (handshake auth, the `typing` membership check, `presence:query` filtering, disconnects).
- **Unread and read receipts:** no tests for the `unreadCountsFor` / `unreadTotalsFor` SQL, which is raw SQL and needs an integration test against a real database.
- **Pagination:** no tests for the `before` cursor at timestamp ties (F3) or for offset drift (F4).
- **Attachments:** no tests for the upload middleware (MIME and extension handling, S2) or for `uploadAttachment`.
- **Frontend behaviour:**
  - No tests for `useChatRealtime` (event handling, mark-read when visible, polling fallback).
  - No tests for `useUnreadMessages`, `useMessengerDrafts` or `useThreadScroll`.
  - No tests for duplicate realtime and REST delivery at the hook level.
- **End-to-end and visual:** no end-to-end chat flows for any role; no responsive or mobile keyboard checks.

---

## 13. Findings Ranked by Severity

| Rank | ID | Severity | Status | Roles | Title |
|---|---|---|---|---|---|
| 1 | S1 | High | Confirmed (code) | ADMIN | Suspended or banned admins keep moderation access to all conversations |
| 2 | S2 | High | Potential | All | Upload trusts the client's MIME type and extension; active content served from the API origin |
| 3 | S3 | Medium | Confirmed (code) | All | Socket sessions not re-validated after suspension or expiry |
| 4 | S4 | Medium | Confirmed (code) | All | Attachments public and never deleted |
| 5 | F1 | Medium | Confirmed (code trace) | All | Stale unread badge for the open conversation after a hidden tab |
| 6 | F2 | Medium | Confirmed (code) | All | Thread force-scrolls to the bottom while reading history |
| 7 | A1 | Medium | Confirmed (code) | All | Message actions not keyboard-accessible |
| 8 | S5 | Low | Confirmed (code) | All | Attachment references not bound to the uploader; metadata client-supplied |
| 9 | S6 | Low | Confirmed (code) | All | Full user directory with email fallback; no consent or blocking |
| 10 | S7 | Low | Potential | All | Only a global IP rate limit; unthrottled `typing` handler |
| 11 | S8 | Low | Confirmed (code) | ADMIN | Moderation deletes not audited; hard deletes |
| 12 | F3 | Low | Potential | All | History cursor skips messages at timestamp ties |
| 13 | F4 | Low | Potential | All | Offset pagination over a moving order |
| 14 | F10 | Low (High if scaled) | Potential | All | Presence and delivery single-process |
| 15 | P1 | Low | Confirmed (code) | All | Lists include every participant of every group |
| 16 | P3 | Low | Confirmed (code) | All | Chatty mark-read and unread traffic |
| 17 | F5 | Low | Confirmed (code) | All | Draft typed during a send is discarded |
| 18 | F6 | Low | Confirmed (code) | All | Realtime messages appended unordered |
| 19 | F7 | Low | Confirmed (code) | All | Orphaned uploads |
| 20 | F8 | Low | Confirmed (code) | ADMIN | Moderation: no de-duplication on older pages; list not live |
| 21 | A2 | Low | Confirmed (code) | ADMIN | Remove button invisible on keyboard focus |
| 22 | A3 | Low | Confirmed (code) | All | New messages not announced to screen readers |
| 23 | P2 | Low | Not verified | All | Nested `take: 1` may be applied after fetching |
| 24 | F9 | Info | Confirmed (code) | All | GET thread marks the conversation read |
| 25 | S9 | Info | Confirmed (code) | All | Socket CORS falls back to any origin |

---

## 14. Recommended Fixes and Priorities

**P0 (security, do first):**

1. **S1:**
   - Add `requireActiveUser` to `/api/v1/admin/*` routers (at least `admin/messages`) and to `/uploads`.
   - Reject non-ACTIVE users in `authService.refresh`.
   - Revoke refresh tokens and disconnect sockets in `updateStatus` when the new status is SUSPENDED or BANNED.
   - Add route and service tests for each of these.
2. **S2:**
   - Validate uploads by their actual content (magic bytes), and derive the extension from the validated type.
   - Serve non-images as attachment downloads with `X-Content-Type-Options: nosniff`, or from a separate domain.
   - Add `CSP: sandbox` on `/uploads`.

**P1 (security and correctness):**

3. **S3:** disconnect a user's sockets on status change, and re-validate long-lived sockets.
4. **S4 and F7:** access-controlled or signed attachment URLs, plus deletion of files with their messages and conversations.
5. **F1:** mark the active conversation read when the tab becomes visible.
6. **F2:** auto-scroll only near the bottom; add a "New messages" indicator.
7. **A1 and A2:** make message actions reachable and visible with the keyboard.

**P2 (hardening and quality):**

8. **S5:** reference uploads by server-side id and owner.
9. **S7:** per-user write limits; throttle `typing` on the server.
10. **S8:** write moderation actions to `ModerationLog`; consider soft delete with tombstones.
11. **F3 and F4:** compound cursors `(createdAt, id)` and `(updatedAt, id)`.
12. **P1 and P3:** trim list payloads; batch mark-read calls.
13. **Missing tests:** admin moderation API, socket auth and membership, unread SQL (integration), `useChatRealtime`, `useThreadScroll`.

**Product decisions (do not change without a requirement):**

- **S6:**
  - Who may message whom: everyone, connections only, or supplier/customer relationships.
  - The email fallback for display names.
  - Consent before being added to a group; blocking.
- **Group features:** read receipts in groups; a "busy" status.
- **Moderation transparency:** whether members are told that admins can read conversations.

**Architecture (opportunistic):**

- Move the shared chat helpers out of `modules/user/messages`.
- Merge the duplicated attachment and image helpers.
- Split `Messenger.jsx` into list, thread and composer.
- Plan for a Redis adapter before running multiple API instances (F10).

---

## 15. Files and Modules Reviewed

**Backend (`server/`):**

- **User messages module:**
  - `src/modules/user/messages/messages.routes.ts`
  - `src/modules/user/messages/messages.controller.ts`
  - `src/modules/user/messages/messages.service.ts`
  - `src/modules/user/messages/messages.validators.ts`
  - `src/modules/user/messages/messages.helpers.ts`
- **Admin messages module:**
  - `src/modules/admin/messages/messages.routes.ts`
  - `src/modules/admin/messages/messages.controller.ts`
  - `src/modules/admin/messages/messages.service.ts`
  - `src/modules/admin/messages/messages.validators.ts`
  - `src/modules/admin/index.ts`
- **Realtime:** `src/realtime/socket.ts`
- **Middleware:**
  - `src/middleware/authenticate.ts`
  - `src/middleware/authorize.ts`
  - `src/middleware/requireActiveUser.ts`
  - `src/middleware/rateLimit.ts`
  - `src/middleware/upload.ts`
- **Uploads:**
  - `src/modules/uploads/uploads.routes.ts`
  - `src/modules/uploads/uploads.controller.ts`
- **App wiring:**
  - `src/app.ts`
  - `src/routes/index.ts`
  - `src/config/env.ts` (rate limit, upload, JWT lifetimes)
- **Auth and user status (as they affect chat):**
  - `src/modules/auth/auth.service.ts` (`refresh`)
  - `src/modules/admin/users/users.service.ts` (`updateStatus`)
- **Database:**
  - `prisma/schema.prisma` (`Conversation`, `ConversationParticipant`, `Message`, `ModerationLog`)
  - Migrations `20260926100000_chat_system`, `20261001120000_message_listing`, `20261018130000_message_system_events`, `20261018140000_message_edited_at`
- **Tests:**
  - `tests/messages.helpers.test.ts`
  - `tests/messages.validators.test.ts`
  - `tests/messages.service.test.ts`

**Frontend (`web/src/`):**

- **`features/messages/`:**
  - `messagesApi.js`, `messagesSlice.js`, `messagesThunks.js`
  - `realtime.js`, `useUnreadMessages.js`
  - `chatPaths.js`, `messagesMappers.js`, `messageFormat.js`
  - `moderation/adminMessagesSlice.js`
- **`modules/messages/`:**
  - `MessagesContainer.jsx`
  - `route/ChatLayout.jsx`, `route/useChatRoute.js`
  - `hooks/useMessagesContainer.js`, `useChatRealtime.js`, `useTypingIndicators.js`, `useMessengerDrafts.js`, `useMobileChatLayout.js`, `useStartConversation.js`
  - `components/layout/MessagesPageContent.jsx`
  - `utils/attachments.js`, `utils/chatModels.js`
  - `constant/constants.js`, `constant/marketplacePaths.js`, `constant/memberProfilePaths.js`
- **Messenger components:**
  - `components/data-display/Messenger/Messenger.jsx`
  - `components/data-display/Messenger/FormattedMessage.jsx`
- **Role pages:**
  - `modules/dash/user/messages/pages/MessagesView.jsx`
  - `modules/dash/supplier/messages/pages/SupplierMessagesView.jsx`
  - `modules/dash/admin/messages/pages/AdminChatView.jsx`, `AdminChatInboxView.jsx`, `AdminChatModerationView.jsx`
  - `modules/dash/admin/messages/hooks/useChatModeration.js`
  - `modules/dash/admin/messages/components/moderation/MessageItem.jsx`
- **Routes:** `shared/router/routes/chat.routes.jsx`, `admin.routes.jsx`, `supplier.routes.jsx`, `user.routes.jsx`
- **Badges and other callers** (references checked): `layouts/panel/PanelLayout.jsx`, `components/navigation/hooks/useNavBadges.js`, plus the users of `useStartConversation`, `chatPath` and `CHAT_BASE_PATHS`.
- **Tests:** the 18 chat test files listed in section 12.

---

## 16. Unverified Areas and Limitations

- **No runtime verification:**
  - No backend, database or test accounts were available, so I could not run end-to-end or API calls.
  - Every "Confirmed" finding is **confirmed by reading the code**, not by exploiting or reproducing it.
  - S1 and F1 have deterministic code paths but were not executed.
- **No browser inspection:**
  - Mobile and desktop layouts for all three roles.
  - Mobile keyboard and `dvh` behaviour, especially iOS Safari with the fixed full-viewport USER messenger.
  - Modal stacking inside the chat, and focus handling in the chat modals.
- **Deployment-dependent:**
  - Whether the web app and API share an origin, which decides how serious S2 is.
  - Whether more than one API instance runs (F10).
  - The real `RATE_LIMIT_*`, `MAX_UPLOAD_SIZE_MB` and `CORS_ORIGINS` values. I read only the code defaults; I didn't inspect `.env`.
- **Prisma SQL generation for nested `take`** (P2) was not inspected.
- **Raw unread SQL** was reviewed but not run against PostgreSQL.
- **Lint and build** were not re-run: this audit changed no application code, and the only new file is this report.
- **Repository notes:**
  - `web/` and `server/` are separate Git repositories.
  - This report is a new, untracked file in the `web` repository.
  - Nothing was committed or pushed.
