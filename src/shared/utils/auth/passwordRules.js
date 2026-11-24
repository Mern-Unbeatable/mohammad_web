/** Mirrors the backend `passwordSchema` rules. */
export const getPasswordChecks = (password) => [
  password.length >= 8,
  /[A-Z]/.test(password),
  /\d/.test(password),
  /[^A-Za-z0-9]/.test(password),
];

export const isStrongPassword = (password) => getPasswordChecks(password).every(Boolean);
