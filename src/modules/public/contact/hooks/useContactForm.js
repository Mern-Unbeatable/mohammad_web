import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getApiErrorMessage, sendContactMessage } from '@/features/public/contact/contactApi';
import { EMPTY_CONTACT_FORM } from '../constant/constants';
import { toContactPayload, validateContactForm } from '../utils/contactForm';

export const useContactForm = () => {
  const [values, setValues] = useState(EMPTY_CONTACT_FORM);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const onChange = (field) => (e) =>
    setValues((prev) => ({ ...prev, [field]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const problem = validateContactForm(values);
    if (problem) {
      toast.error(problem);
      return;
    }

    setSending(true);
    try {
      await sendContactMessage(toContactPayload(values));
      setSent(true);
      setValues(EMPTY_CONTACT_FORM);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Your message could not be sent. Please try again.'));
    } finally {
      setSending(false);
    }
  };

  return {
    values,
    sending,
    sent,
    onChange,
    onSubmit,
    onSendAnother: () => setSent(false),
  };
};
