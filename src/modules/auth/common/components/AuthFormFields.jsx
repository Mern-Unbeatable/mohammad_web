import { Eye, EyeOff } from 'lucide-react';
import { getPasswordChecks } from '@/modules/auth/utils/passwordRules';

export const labelClass = 'mb-1.5 block text-base font-medium text-deep-blue';
export const inputClass =
  'w-full rounded-md border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-[15px] text-deep-blue outline-none transition-colors placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:bg-gray-100';

export const PasswordField = ({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
  disabled,
  autoComplete,
}) => (
  <div>
    <label htmlFor={id} className={labelClass}>
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`${inputClass} pr-10`}
        placeholder="••••••••"
        required
      />
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#64748B]"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  </div>
);

export const PasswordStrength = ({ password }) => (
  <div>
    <p className="text-[14px] text-[#64748B]">
      Use 8+ characters with an uppercase letter, a number and a symbol.
    </p>
    <div className="mt-2 flex gap-2">
      {getPasswordChecks(password).map((passed, index) => (
        <span
          key={index}
          className={`h-1 flex-1 rounded-full ${passed ? 'bg-primary' : 'bg-[#E4E7EC]'}`}
        />
      ))}
    </div>
  </div>
);
