# Auth forgot-password — structure

The `/forgot-password` page. The user enters their email (prefilled from
history state `email` when coming from the login page) and
`useAuth().forgotPassword` sends a reset link. The page then switches to a
"Check your email" state with a resend button held back by a 60-second
cooldown that matches the server's per-account limit.

## Folder layout

```
forgot-password/
├── pages/
│   └── ForgotPasswordView.jsx        Heading + form or link-sent state
│
├── constant/
│   └── constants.js                  Login path, cooldown, success toast, headings
│
├── components/
│   ├── ForgotPasswordForm.jsx        Email field, submit, BackToSignIn (from auth/components)
│   └── LinkSentState.jsx             Confirmation, resend with countdown, "Use a different email"
│
├── hooks/
│   └── useForgotPassword.js          Email, send + toasts, sent address, cooldown ticker
│
├── utils/
│   └── cooldown.js                   cooldownEnd, secondsUntil, resendLabel
│
├── test/
│   ├── cooldown.test.js
│   └── ForgotPasswordView.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Rules

- The page only wires the hook to components; components hold no state.
- The hook owns `useAuth` calls, the timer and toasts; utils are pure.
