import { MESSAGE_MIN_LENGTH } from '../constant/constants';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Trimmed request body; empty optional fields are left out. */
export const toContactPayload = (values) => {
  const payload = {
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    inquiryType: values.inquiryType,
    message: values.message.trim(),
  };
  const phone = values.phone.trim();
  const company = values.company.trim();
  if (phone) payload.phone = phone;
  if (company) payload.company = company;
  return payload;
};

/** First problem with the form, or '' when it can be sent. */
export const validateContactForm = (values) => {
  const payload = toContactPayload(values);
  if (!payload.fullName) return 'Please enter your full name.';
  if (!EMAIL_PATTERN.test(payload.email)) return 'Please enter a valid email address.';
  if (payload.message.length < MESSAGE_MIN_LENGTH) {
    return `Your message must be at least ${MESSAGE_MIN_LENGTH} characters.`;
  }
  return '';
};
