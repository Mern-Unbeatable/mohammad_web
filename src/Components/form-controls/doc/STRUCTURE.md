# form-controls

Shared form controls. Import from the barrel:

```js
import { Input, Select, FormLabel } from '@/components/form-controls';
```

```
form-controls/
├── formStyles.js        FIELD_VARIANTS, LABEL_VARIANTS, fieldClass(), labelClass()
├── Input.jsx            <input>, default type "text"
├── Textarea.jsx         <textarea>
├── Select.jsx           <select>, optional `options` (strings or { value, label, disabled })
├── Checkbox.jsx         <input type="checkbox">
├── PasswordInput.jsx    password input + show/hide toggle (controlled or self-managed)
├── SearchInput.jsx      search icon + <input type="search">
├── RichTextArea.jsx     textarea + formatting toolbar (bold, italic, lists, links…)
├── FormLabel.jsx        <label> (or `as="p"` / `as="span"`), optional required mark
├── FormField.jsx        label + control + hint + error, ids `${htmlFor}-hint` / `-error`
├── FormError.jsx        inline error with role="alert"; renders nothing when empty
├── index.js
├── doc/STRUCTURE.md
└── test/formControls.test.jsx
```

## Variants

Each variant is a look that already existed in the app. Use the one the
surrounding form uses; do not add per-page class strings.

| Variant     | Field (`Input`, `Textarea`, `Select`)                    | Label (`FormLabel`)  |
| ----------- | -------------------------------------------------------- | -------------------- |
| `default`   | Dashboard panels, dialogs, listing and profile forms     | 13px semibold        |
| `auth`      | Login, register, password recovery                       | 16px medium          |
| `editor`    | Admin blog editor, moderation reason dialogs             | 14px medium          |
| `prominent` | Job post form (hover border, 4px focus ring)             | (form uses its own)  |
| `settings`  | Admin platform settings                                  | (page uses theme)    |
| `compact`   | 36px inline selects (chart period pickers)               | —                    |

`SearchInput` has its own variants: `default` (toolbars), `compact` (pickers),
`pill` (conversation lists), `hero` (blog heroes).

## Rules

- `className` is appended after the preset, so modifiers (`resize-y`, `pr-10`,
  `sm:text-[15px]`) work without repeating the base classes.
- `invalid` sets `aria-invalid="true"`; an explicit `aria-invalid` prop wins.
- Keep option lists, validation and payload logic in the feature module; these
  components only render markup.
- Specialised controls stay in their features: hidden file pickers, auto-growing
  comment and message composers, the job form's segmented radio group, toolbar
  `FilterSelect`s, the navbar search and the data-table search.
