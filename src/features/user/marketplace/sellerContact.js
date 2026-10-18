/** Shortest/longest valid E.164 numbers (country code included). */
const MIN_PHONE_DIGITS = 8;
const MAX_PHONE_DIGITS = 15;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Digits for `wa.me`: drops formatting and a leading `00` international prefix. */
export function toWhatsAppNumber(phone) {
  if (typeof phone !== "string") return null;
  let digits = phone.replace(/\D/g, "");
  if (!phone.trim().startsWith("+") && digits.startsWith("00")) digits = digits.slice(2);
  return digits.length >= MIN_PHONE_DIGITS && digits.length <= MAX_PHONE_DIGITS
    ? digits
    : null;
}

/**
 * Email / WhatsApp links for a listing's seller, pre-filled with the listing
 * title. A link is null when the seller didn't share a usable value.
 */
export function sellerContactLinks(seller, listingTitle = "") {
  const subject = listingTitle
    ? `Lab Unity listing: ${listingTitle}`
    : "Your Lab Unity listing";
  const greeting = listingTitle
    ? `Hi, I'm interested in your listing "${listingTitle}" on Lab Unity.`
    : "Hi, I'm interested in your listing on Lab Unity.";

  const email = typeof seller?.email === "string" ? seller.email.trim() : "";
  const whatsApp = toWhatsAppNumber(seller?.phone);

  return {
    emailHref: EMAIL_PATTERN.test(email)
      ? `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(greeting)}`
      : null,
    whatsAppHref: whatsApp
      ? `https://wa.me/${whatsApp}?text=${encodeURIComponent(greeting)}`
      : null,
  };
}
