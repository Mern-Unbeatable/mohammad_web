import {
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Send,
  User,
} from 'lucide-react';
import { FormLabel, Input, Textarea } from '@/components/form-controls';
import SelectField from '@/modules/auth/register/components/SelectField';
import { useContactForm } from '../hooks/useContactForm';
import { INQUIRY_OPTIONS, MESSAGE_MAX_LENGTH } from '../constant/constants';

const OptionalTag = () => <span className="font-normal text-[#98A2B3]"> (optional)</span>;

const FieldIcon = ({ icon: Icon }) => (
  <Icon className="mr-1.5 inline h-3.5 w-3.5 text-slate-400" strokeWidth={2.25} aria-hidden="true" />
);

const SentState = ({ onSendAnother }) => (
  <div className="flex flex-col items-center py-10 text-center">
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
      <CheckCircle2 className="h-6 w-6 text-green-600" strokeWidth={2.2} />
    </span>
    <h2 className="mt-4 text-[20px] font-bold text-deep-blue">Message sent</h2>
    <p className="mt-2 max-w-[360px] text-[15px] leading-[1.6] text-[#64748B]">
      Thank you for reaching out. We&apos;ll get back to you by email as soon as possible.
    </p>
    <button
      type="button"
      onClick={onSendAnother}
      className="mt-6 text-[14px] font-semibold text-primary hover:underline"
    >
      Send another message
    </button>
  </div>
);

const ContactForm = () => {
  const { values, sending, sent, onChange, onSubmit, onSendAnother } = useContactForm();

  if (sent) return <SentState onSendAnother={onSendAnother} />;

  return (
    <form className="space-y-5" onSubmit={onSubmit} noValidate>
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/10">
          <MessageSquare className="h-[18px] w-[18px]" strokeWidth={2.25} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-[16px] font-semibold text-deep-blue">Send a message</h2>
          <p className="text-[13px] text-slate-500">We typically reply within 1–2 business days.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <FormLabel variant="auth" htmlFor="contact-fullName">
            <FieldIcon icon={User} />
            Full Name
          </FormLabel>
          <Input
            variant="auth"
            id="contact-fullName"
            value={values.fullName}
            onChange={onChange('fullName')}
            placeholder="Jane Doe"
            maxLength={120}
            autoComplete="name"
            disabled={sending}
            required
          />
        </div>
        <div>
          <FormLabel variant="auth" htmlFor="contact-email">
            <FieldIcon icon={Mail} />
            Email Address
          </FormLabel>
          <Input
            variant="auth"
            id="contact-email"
            type="email"
            value={values.email}
            onChange={onChange('email')}
            placeholder="you@laboratory.com"
            maxLength={254}
            autoComplete="email"
            disabled={sending}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <FormLabel variant="auth" htmlFor="contact-phone">
            <FieldIcon icon={Phone} />
            Phone Number
            <OptionalTag />
          </FormLabel>
          <Input
            variant="auth"
            id="contact-phone"
            type="tel"
            value={values.phone}
            onChange={onChange('phone')}
            placeholder="+32 123 45 67 89"
            maxLength={40}
            autoComplete="tel"
            disabled={sending}
          />
        </div>
        <div>
          <FormLabel variant="auth" htmlFor="contact-company">
            <FieldIcon icon={Building2} />
            Company
            <OptionalTag />
          </FormLabel>
          <Input
            variant="auth"
            id="contact-company"
            value={values.company}
            onChange={onChange('company')}
            placeholder="Acme Labs"
            maxLength={160}
            autoComplete="organization"
            disabled={sending}
          />
        </div>
      </div>

      <SelectField
        id="contact-inquiryType"
        label="Inquiry Type"
        value={values.inquiryType}
        onChange={onChange('inquiryType')}
        disabled={sending}
      >
        {INQUIRY_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </SelectField>

      <div>
        <FormLabel variant="auth" htmlFor="contact-message">
          <FieldIcon icon={MessageSquare} />
          Message
        </FormLabel>
        <Textarea
          variant="auth"
          id="contact-message"
          rows={6}
          value={values.message}
          onChange={onChange('message')}
          placeholder="How can we help you?"
          maxLength={MESSAGE_MAX_LENGTH}
          className="resize-none"
          disabled={sending}
          required
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {sending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" strokeWidth={2.25} />
            Send message
          </>
        )}
      </button>
    </form>
  );
};

export default ContactForm;
