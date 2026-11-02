# Messages module structure

API-backed messenger shared by the User, Supplier and Admin inboxes. Each
role's view renders `ChatLayout`, which reads the chat route and renders
`MessagesContainer`. The URL is the source of truth: `section` picks the tab,
`targetId` the open conversation, and `?listing=<id>` preloads a listing.

```
modules/messages/
├── MessagesContainer.jsx         # thin: useMessagesContainer → page + modals
├── index.js                      # public API (see below)
├── route/                        # ChatLayout, ChatRedirect, LegacyChatRedirect, useChatRoute
├── constant/constants.js         # tabs, timings, media queries, limits, messages
├── components/
│   ├── layout/MessagesPageContent.jsx   # Messenger shell (dashboard / panel)
│   └── recipients/RecipientPicker.jsx
│   (modals live in @/components/modals/messages: NewMessage, CreateGroup,
│    ConversationInfo, AddMembers, DeleteMessage, LeaveGroup, EditMessage and
│    StartConversation — the "Message" button flow outside the inbox)
├── hooks/
│   ├── useMessagesContainer.js   # orchestrator: slice, handlers, modal state
│   ├── useTypingIndicators.js    # who is typing, with expiry timers
│   ├── useConversationSearch.js  # debounced search + conversation fetch
│   ├── useListingDraft.js        # ?listing= → pending listing card
│   ├── useOpenConversationFromUrl.js
│   ├── useOpenNewestOnDesktop.js
│   ├── useChatRealtime.js        # socket events, typing emitter, polling, presence
│   ├── useChatModels.js          # view models for list and open thread
│   ├── useMessengerDrafts.js     # per-chat drafts + attachment uploads
│   ├── useMobileChatLayout.js    # scroll lock / bottom nav on mobile
│   └── useStartConversation.js   # send first message, then open the chat
├── utils/                        # pure: chatTabs, chatModels, chatListing,
│                                 # attachments, recipientPickerText
├── test/
└── doc/STRUCTURE.md
```

## Public API (`@/modules/messages`)

| Export | Used by |
|---|---|
| `MessagesContainer` | `route/ChatLayout` |
| `ChatLayout` | role `*MessagesView` / `AdminChatInboxView` |
| `ChatRedirect`, `LegacyChatRedirect` | `shared/router/routes/chat.routes.jsx` |
| `StartConversationModal`, `useStartConversation` | contacts, marketplace, admin user / listing detail |
| `RecipientPicker` | feed `SharePostModal` |

`route/` is not named `layout/` because app layouts live only in `src/layouts/`.

## Rules

- Components render only; state, effects, dispatch and toasts live in hooks.
- Hooks inside `useMessagesContainer` are called in the original effect order
  (typing timers, reset, search, error toast, listing, URL, desktop, realtime).
- Utils are pure and unit-tested.
