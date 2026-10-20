# Form controls centralization report

Scope: `web/src`. Status: uncommitted working-tree changes (37 files changed,
plus the new `src/Components/form-controls/` folder).

## 1. Original architecture

There was no shared form-control layer. Each form copied its own Tailwind
class strings and small helper components:

- **Panel/dialog style** (`border-[#E4E7EC]`, 14px, `ring-primary/10`) was
  declared as a local `fieldClass` / `labelClass` in nine places:
  `NewMessageModal`, `CreateGroupModal`, `ConversationInfoModal`,
  `StartConversationModal`, `AdminAccountForm`, `ProfileSetupForm`,
  `CreateGeneralPostModal`, `CreateAdModal`, and marketplace
  `components/form/formStyles.js`. It was also pasted inline in
  `ApplyForm` and `SupplierJobDetailView`.
- **Auth style** lived in `modules/auth/components/AuthFormFields.jsx`
  (`inputClass`, `labelClass`) and was imported by Login, Register, Forgot
  password and the register `SelectField`.
- **Three more page-local styles**: `JobPostForm` (hover border, 4px ring),
  `AdminCreateBlogView` (`border-[#D0D5DD]`, 14px label; the same string was
  inline in `ReasonModal` and `SuspendUserModal`), and `AdminSettingsView`.
- **Password with eye toggle** was implemented three times: auth
  `PasswordField`, `AdminAccountForm`'s local `PasswordField`, and inline in
  `LoginView`.
- **Search box with icon** was copy-pasted in seven files, in four looks.
- **Chart period select** was copy-pasted in four files.
- **Checkbox** style was copy-pasted in Login and Register.

## 2. New structure

```
src/Components/form-controls/          (imported as @/components/form-controls)
├── formStyles.js     FIELD_VARIANTS, LABEL_VARIANTS, fieldClass(), labelClass()
├── Input.jsx  Textarea.jsx  Select.jsx  Checkbox.jsx
├── PasswordInput.jsx  SearchInput.jsx
├── FormLabel.jsx  FormField.jsx  FormError.jsx
├── index.js
├── doc/STRUCTURE.md
└── test/formControls.test.jsx         (12 tests)
```

The folder sits next to the existing `Components/{forms,loader,modals,ui}`
folders and follows the same layout (`doc/`, `test/`, barrel `index.js`). The
brief suggested `shared/components/form-controls`, but `src/shared` has no
components folder; every shared UI component lives under `src/Components`.

Variants are the looks that already existed (`default`, `auth`, `editor`,
`prominent`, `settings`, `compact`). Each class string was copied verbatim,
and callers' extra classes are appended after the preset, so migrated fields
render the same set of classes as before. The folder imports only
`lucide-react` and its own files, so there are no circular imports.

## 3. Components

| Component       | Status  | Replaces                                                              |
| --------------- | ------- | --------------------------------------------------------------------- |
| `formStyles.js` | created | 9 local `fieldClass`/`labelClass` copies, marketplace `formStyles.js` (deleted), auth `inputClass`/`labelClass` exports (removed) |
| `Input`         | created | text-like `<input>`s using those class strings                        |
| `Textarea`      | created | `<textarea>`s using them                                              |
| `Select`        | created | `<select>`s using them, plus the 4 chart period selects               |
| `FormLabel`     | created | `<label>` / `<p>` captions using `labelClass`                         |
| `FormError`     | created | inline alert in `StartConversationModal`                              |
| `FormField`     | created | new; not yet used by migrated forms (see section 7)                   |
| `PasswordInput` | created | Login inline toggle, auth `PasswordField` internals, `AdminAccountForm` `PasswordField` internals |
| `Checkbox`      | created | Login and Register checkboxes                                         |
| `SearchInput`   | created | 7 icon + search-input copies                                          |
| auth `PasswordField`, `PasswordStrength` | kept, rebuilt | same props; now built on `FormLabel` + `PasswordInput` |
| auth register `SelectField` | kept, rebuilt | same props; chevron icon kept, uses `FormLabel` + `Select` |
| marketplace `SelectField` | kept, rebuilt | same props; uses `FormLabel` + `Select`             |
| `JobPostForm` local `Field`, `SelectField` | kept | layout with "Optional" pill and hint; controls inside now use `Input`/`Select`/`Textarea variant="prominent"` |

## 4. Files refactored

Each file below now gets its fields, labels, password toggles, search boxes
or checkboxes from `form-controls`:

- **Auth:** `modules/auth/components/AuthFormFields.jsx`,
  `login/pages/LoginView.jsx`, `register/pages/RegisterView.jsx`,
  `register/components/SelectField.jsx`,
  `forgot-password/pages/ForgotPasswordView.jsx`.
  `ResetPasswordView` uses `PasswordField` unchanged.
- **Feature forms:** `AdminAccountForm` and `ProfileSetupForm`, which were in
  `Components/forms/` when migrated. They have since moved to
  `modules/dash/admin/components/profile/` and
  `modules/dash/user/pages/profile/components/setup/`. `RichTextArea` moved
  into `form-controls/`, and `Components/forms/` was removed.
- **Modals:** `messages/{NewMessage,CreateGroup,ConversationInfo,StartConversation}Modal.jsx`,
  `general/CreateGeneralPostModal.jsx`, `supplier/CreateAdModal.jsx`,
  `admin/{Reason,SuspendUser}Modal.jsx`.
- **Marketplace:** `components/form/{ListingForm,SelectField,PhotoPicker}.jsx`,
  `components/toolbar/MarketplaceToolbar.jsx`. `components/form/formStyles.js`
  was deleted.
- **Recruitment:** `components/form/JobPostForm.jsx`,
  `components/detail/ApplyForm.jsx`, `components/toolbar/RecruitmentToolbar.jsx`.
- **Admin:** `pages/{AdminCreateBlog,AdminSettings,AdminDashboard,AdminStatistics}View.jsx`,
  `components/chat/ChatModerationPanel.jsx`.
- **Supplier:** `pages/SupplierBlogsView.jsx`, `pages/SupplierJobDetailView.jsx`.
- **Other:** `Components/data-display/{LineChartCard,BarChartCard,Messenger}`,
  `modules/messages/components/recipients/RecipientPicker.jsx`,
  `modules/dash/user/pages/blogs/components/hub/BlogsHero.jsx`.
- **Docs:** `modules/auth/doc/STRUCTURE.md`,
  `modules/dash/user/pages/marketplace/doc/STRUCTURE.md`.
- **Unrelated path fix:** `Components/ui/test/Avatar.test.jsx` imported
  `./Avatar` after commit `6bd6d16` moved it into `test/`. It now imports
  `../Avatar`, which fixed a failing test file.

Names, ids, values, placeholders, options, `required`/`disabled`/`readOnly`,
handlers and payloads were not changed. Most edits were made by a script that
parses the JSX and only swaps the tag name and the `className` attribute;
everything else was edited by hand and reviewed in the diff.

## 5. Native or specialized controls left in place

Found by listing every remaining `<input>`, `<select>` and `<textarea>` outside
`form-controls/` after the refactor:

| Control                                             | Where                                                                 | Why it stays |
| --------------------------------------------------- | --------------------------------------------------------------------- | ------------ |
| Hidden `type="file"` pickers                        | Messenger, AdminAccountForm, ProfileSetupForm, CreateGeneralPostModal, CreateAdModal, AdminCreateBlogView, ComposerFooter, PhotoPicker, JobImageField | Hidden inputs triggered by custom buttons or drop zones; each has its own preview and validation |
| Auto-growing or borderless textareas                | Messenger composer, RichTextArea, CreatePostModal, EditMessageModal, CommentComposer, CommentEditForm, InlineReplyBox | Borderless editor surfaces with auto-resize and keyboard handling; not field-styled |
| ReportPostModal and SharePostModal textareas        | feed modals                                                           | One-off styles (`rounded-md`, `px-3 py-2`, `sm:px-4`); converting them would change their look |
| Segmented `type="radio"` group                      | JobPostForm (workplace type)                                          | Visually a segmented button group; only one radio group in the app |
| Blog-editor publish checkbox                        | AdminCreateBlogView                                                   | Uses `focus:ring-primary`, not `/20`; kept to avoid a visual change |
| Toolbar `FilterSelect`s                             | recruitment `FilterSelect.jsx`, `AdminRecruitmentView`                | Different compact filter styles and wrappers |
| Contacts filter search + select                     | `DirectoryFilters`, `SupplierContactsView`                            | No icon, `px-4`; the two are near-duplicates of each other (see section 7) |
| Navbar search, data-table search and page-size select | `NavSearchField`, `DataTable`                                       | Custom sizes and behaviour tied to those components |
| Admin settings labels                               | AdminSettingsView                                                     | Use `panelPageTheme.cardBody`, not a field label style |

No date or time picker library exists. The only `type="date"` / `type="time"`
inputs, in `CreateAdModal`, now use `Input` with those native types. There is
no switch component in a form. The recruitment `ViewModeToggle` is a view
toggle, not a form control, and was left alone.

## 6. Commands and results

All commands were run from `web/`.

| Command | Result |
| ------- | ------ |
| `npx vitest run src/Components/form-controls` | 1 file, 12/12 tests passed |
| `npx vitest run` | 90 files, 660/661 passed. The single failure is `ContactCard.test.jsx` ("uses the same brand cover colour…"), which also fails without these changes. Before the `Avatar.test.jsx` path fix the run showed 2 failed files |
| `npx eslint <every modified .jsx/.js file + src/Components/form-controls>` | 5 errors and 2 warnings, all in files that report the same problems at HEAD: `set-state-in-effect` in ReasonModal, SuspendUserModal and SupplierBlogsView; unused `Icon` in CreateGeneralPostModal; `exhaustive-deps` warnings in AdminStatisticsView. Checked by linting `git show HEAD:<file>` for each. `src/Components/form-controls` lints clean |
| `npx vite build` | Built in 5.3s. The built CSS was checked for classes that now exist only in `formStyles.js` / `SearchInput.jsx` (`focus:ring-4`, `focus:ring-primary/15`, `disabled:bg-gray-100`, `hover:border-[#98A2B3]`, `focus:bg-white`, `sm:py-3`); all are present |

The UI was not checked in a browser. Visual sameness rests on the class
strings being identical.

## 7. Known differences, unresolved issues, follow-up

Small markup differences introduced:

- Inputs that had no `type` now render `type="text"`, which is the browser
  default anyway.
- The `StartConversationModal` error icon gained `aria-hidden="true"`.
- `ReasonModal` and `SuspendUserModal` textareas gained `bg-white`. Textareas
  already render white by default, but the class is new.
- Some class lists changed order, e.g. a label's `mt-5` or the register
  checkbox's `mt-0.5`. Tailwind CSS does not depend on attribute order, so
  this has no visual effect.
- Existing required asterisks (`<span className="text-pink-light"> *</span>`)
  were left as written. `FormLabel`'s new `required` prop is available, but
  migrated forms do not use it yet.

Not done, recommended next:

1. **Consolidate the look variants.** `editor`, `settings` and `prominent`
   differ from `default` in border colour, ring size and label size. Merging
   them is a design decision, so the variants were kept rather than changing
   the UI.
2. **Adopt `FormField`.** Migrated forms still write `<div><FormLabel/><Input/></div>`
   by hand. Moving to `FormField` would add hint and error wiring
   (`aria-describedby`) consistently. `JobPostForm`'s `Field` could become
   `FormField` plus an "Optional" badge.
3. **Merge the contacts filters.** `SupplierContactsView` re-implements
   `DirectoryFilters` (same search and select, different class order). It
   should reuse that component.
4. **Unify `FilterSelect`.** The recruitment and admin recruitment versions
   could become one shared filter select.
5. **Add interaction tests.** The suite has no DOM environment (no jsdom or
   Testing Library), so password-toggle clicks and focus behaviour are not
   tested; the tests are markup-only.
6. **Fix the pre-existing failures.** The `ContactCard` brand-cover test and
   the lint errors listed in section 6 predate this work.
