# Admin messages — structure

Admin chat (`/admin/chat`): a shell with two tabs, "My conversations" (the
shared messenger, `ChatLayout`) and "Moderation" (`/admin/chat/moderation`), a
read-only view of every conversation on the platform with message and
conversation removal. Moderation data comes from
`@/features/messages/moderation` (`state.adminMessages`).

## Folder layout

```
messages/
├── pages/
│   ├── AdminChatView.jsx             Header + SegmentedTabs, <Outlet /> for the active tab
│   ├── AdminChatInboxView.jsx        Shared ChatLayout (panel variant)
│   └── AdminChatModerationView.jsx   ConversationList, ThreadPanel, RemovalModals
│
├── index.js                          Public API: ADMIN_CHAT_PATH, ADMIN_CHAT_MODERATION_PATH
│
├── constant/
│   └── constants.js                  Paths, tabs, search debounce, type filter options, system message type
│
├── components/
│   ├── moderation/
│   │   ├── ConversationList.jsx      Left column: filters, rows, Load more
│   │   ├── ConversationFilters.jsx   Search, All / Direct / Groups, total
│   │   ├── ConversationItem.jsx      One row
│   │   ├── ThreadPanel.jsx           Right column: header, Load older, messages, or placeholder
│   │   ├── ThreadHeader.jsx          Back, name, participant chips, Delete conversation
│   │   ├── MessageItem.jsx           System note or member message with attachments + Remove
│   │   └── RemovalModals.jsx         Remove message / Delete conversation confirms
│   └── common/
│       └── Spinner.jsx
│
├── hooks/
│   ├── useChatTabs.js                Active tab from the URL, navigate on change
│   └── useChatModeration.js          Debounced search, type, list / thread loading, removal flow + toasts
│
├── utils/
│   └── moderation.js                 activeChatTab, chatTabPath, countLabel, hasMorePages, nextPage, isSystemMessage
│
├── test/
│   ├── moderation.test.js
│   └── MessagesViews.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Rules

- Pages only wire hooks to components; components never dispatch.
- Hooks own Redux access, navigation and toasts; utils are pure.
- `useChatModeration` returns three groups, `list`, `thread` and `removal`,
  one per column / modal set.

## Notes

- `ChatModerationPanel` (`components/`) became the page
  `pages/AdminChatModerationView.jsx`; `admin.routes.jsx` lazy-loads the new path.
