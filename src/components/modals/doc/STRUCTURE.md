# Modals structure

Every modal dialog in the app, one file each, grouped by the area that opens it.
`ConfirmModal` is the base dialog; the delete / leave / withdraw modals are thin
presets on top of it.

```
components/modals/
├── index.js                        # public API: every modal by name
├── common/
│   ├── ConfirmModal.jsx            # base confirm dialog (title, message, confirm / cancel, tone)
│   └── DeletePostModal.jsx         # ConfirmModal preset for deleting a post
├── feed/
│   ├── CreatePostModal.jsx         # create / edit a feed post (uses feed composer parts)
│   ├── FullCommentsModal.jsx
│   ├── ReportPostModal.jsx
│   └── SharePostModal.jsx
├── general/
│   └── CreateGeneralPostModal.jsx  # also used by the supplier general posts pages
├── marketplace/
│   └── DeleteListingModal.jsx
├── recruitment/
│   ├── AllCandidatesModal.jsx
│   ├── ApplicantDetailsModal.jsx
│   ├── DeleteJobModal.jsx
│   └── WithdrawApplicationModal.jsx
├── subscription/
│   └── CancelSubscriptionModal.jsx
├── messages/
│   ├── AddMembersModal.jsx
│   ├── ConversationInfoModal.jsx
│   ├── CreateGroupModal.jsx
│   ├── DeleteMessageModal.jsx
│   ├── EditMessageModal.jsx        # opened from Messenger
│   ├── LeaveGroupModal.jsx
│   ├── NewMessageModal.jsx
│   └── StartConversationModal.jsx  # opened from profiles / listings ("Message")
├── admin/
│   ├── ModerationHistoryModal.jsx
│   ├── ReasonModal.jsx
│   └── SuspendUserModal.jsx
├── supplier/
│   └── CreateAdModal.jsx
├── test/
└── doc/STRUCTURE.md
```

## Importing

- Pages import a modal by file path, e.g.
  `import ConfirmModal from '@/components/modals/common/ConfirmModal'`, so a
  lazy-loaded page only pulls in the modals it uses. `index.js` lists every
  modal for discovery and for non-lazy code.
- Older page-level public APIs still re-export their modals from here
  (`@/modules/dash/user/feed` → `CreatePostModal`, `ReportPostModal`;
  `.../general` → `CreateGeneralPostModal`; `.../subscription` →
  `CancelSubscriptionModal`; `@/modules/messages` → `StartConversationModal`).

## Rules

- Feature-specific pieces a modal composes (composer parts, candidate rows,
  hooks, constants) stay in their feature folder and are imported by `@/` path.
- A new confirm-style dialog should be a preset of `common/ConfirmModal`.
- Overlays that are not modal dialogs stay where they are: `ImageViewer`
  (`components/common`), `MobileMenuDrawer` and hover menus (`components/navigation`).
