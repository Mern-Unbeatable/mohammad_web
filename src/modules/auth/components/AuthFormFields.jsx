import { FormLabel, PasswordInput } from '@/components/form-controls';
import { getPasswordChecks } from '@/shared/utils/auth/passwordRules';

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
    <FormLabel variant="auth" htmlFor={id}>
      {label}
    </FormLabel>
    <PasswordInput
      variant="auth"
      id={id}
      value={value}
      onChange={onChange}
      visible={visible}
      onToggleVisible={onToggle}
      disabled={disabled}
      autoComplete={autoComplete}
      placeholder="••••••••"
      required
    />
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
