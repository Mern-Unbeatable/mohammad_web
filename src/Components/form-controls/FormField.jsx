import FormLabel from './FormLabel';
import FormError from './FormError';
import { HINT_CLASS } from './formStyles';

/**
 * Label + control + optional hint/error. The control is passed as children so
 * any control (Input, Select, PasswordInput, a custom picker) fits. Pass the
 * control's id as `htmlFor`, and point its `aria-describedby` at
 * `${htmlFor}-hint` / `${htmlFor}-error` when rendering those.
 */
const FormField = ({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  variant = 'default',
  labelClassName,
  className,
  children,
}) => (
  <div className={className}>
    {label ? (
      <FormLabel
        htmlFor={htmlFor}
        variant={variant}
        required={required}
        className={labelClassName}
      >
        {label}
      </FormLabel>
    ) : null}
    {children}
    {hint ? (
      <p id={htmlFor ? `${htmlFor}-hint` : undefined} className={HINT_CLASS}>
        {hint}
      </p>
    ) : null}
    <FormError id={htmlFor ? `${htmlFor}-error` : undefined}>{error}</FormError>
  </div>
);

export default FormField;
