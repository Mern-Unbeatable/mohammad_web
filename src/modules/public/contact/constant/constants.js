export const CONTACT_PATH = '/contact';

export const CONTACT_EMAIL = 'info@labunity.be';

/** Values must match the server's INQUIRY_TYPES. */
export const INQUIRY_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'membership', label: 'Membership' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'technical', label: 'Technical' },
];

export const EMPTY_CONTACT_FORM = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  inquiryType: 'general',
  message: '',
};

export const MESSAGE_MIN_LENGTH = 10;
export const MESSAGE_MAX_LENGTH = 5000;
