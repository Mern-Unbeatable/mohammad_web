# Auth reset-password — structure

The `/reset-password` page. The emailed link carries `?token=`; the page moves
the token into history state (out of the address bar), verifies it through
`useAuth().verifyResetToken`, then lets the user set a new password with
`useAuth().resetPassword`.

## Folder layout

```
reset-password/
├── pages/
│   └── ResetPasswordView.jsx         Heading + one state component per status
│
├── constant/
│   └── constants.js                  Paths, token pattern, statuses, messages, headings, button class
│
├── components/
│   ├── states/
│   │   ├── CheckingState.jsx         Spinner while the token is verified
│   │   ├── InvalidLinkState.jsx      Bad / expired / missing link + "Request a new reset link"
│   │   ├── CheckErrorState.jsx       Verify failed (network / server) + "Try again"
│   │   └── DoneState.jsx             Success + "Continue to Sign In"
│   ├── form/
│   │   └── ResetPasswordForm.jsx     Password fields (AuthFormFields), strength, submit, expiry
│   └── common/
│       └── Notice.jsx                Red alert box (BackToSignIn comes from auth/components)
│
├── hooks/
│   └── useResetPassword.js           Token handling, verify + retry, form state, submit + toasts
│
├── utils/
│   └── resetPassword.js              isValidTokenFormat, readToken, toCheck, resolveStatus,
│                                     validatePasswords, formatExpiry
│
├── test/
│   ├── resetPassword.test.js
│   └── ResetPasswordView.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Statuses

| Status     | When                                                      |
| ---------- | --------------------------------------------------------- |
| `done`     | The password was reset                                    |
| `invalid`  | No token, malformed token, or the server answered 400     |
| `checking` | Token is well-formed and has not been verified yet        |
| `valid`    | Verified; the form is shown                               |
| `error`    | Verification failed for another reason; retry is offered  |

A 400 on submit also switches the page to `invalid`.

## Rules

- The page only wires the hook to components; components hold no state.
- The hook owns routing, `useAuth` calls and toasts; utils are pure.
