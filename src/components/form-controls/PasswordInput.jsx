import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from './Input';

const TOGGLE_HOVER = {
  auth: 'hover:text-[#64748B]',
  default: 'hover:text-deep-blue',
};

/**
 * Password input with a show/hide toggle. Controlled when `visible` and
 * `onToggleVisible` are passed, otherwise it tracks visibility itself.
 */
const PasswordInput = ({
  variant = 'default',
  visible: visibleProp,
  onToggleVisible,
  className,
  disabled,
  ...props
}) => {
  const [visibleState, setVisibleState] = useState(false);
  const controlled = visibleProp !== undefined;
  const visible = controlled ? visibleProp : visibleState;
  const toggle = controlled
    ? onToggleVisible
    : () => setVisibleState((value) => !value);

  return (
    <div className="relative">
      <Input
        {...props}
        variant={variant}
        type={visible ? 'text' : 'password'}
        disabled={disabled}
        className={className ? `pr-10 ${className}` : 'pr-10'}
      />
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        className={`absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] ${
          TOGGLE_HOVER[variant] ?? TOGGLE_HOVER.default
        }`}
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
};

export default PasswordInput;
