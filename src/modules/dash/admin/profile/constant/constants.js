export const PROFILE_PATH = "/admin/profile";

export const EMPTY_PASSWORDS = { current: "", next: "", confirm: "" };

export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";
export const IMAGE_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export const DEFAULT_INITIALS = "AD";

export const MESSAGES = {
  NAME_REQUIRED: "Name is required",
  PROFILE_UPDATED: "Profile updated",
  BAD_IMAGE: "Please upload a JPG, PNG, or WebP image",
  AVATAR_UPDATED: "Profile photo updated",
  PASSWORDS_MISSING: "Fill in all password fields",
  PASSWORDS_MISMATCH: "New passwords do not match",
  PASSWORD_UPDATED: "Password updated",
};
