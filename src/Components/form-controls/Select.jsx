import { fieldClass } from './formStyles';

const toOption = (option) =>
  typeof option === 'object' && option !== null
    ? option
    : { value: option, label: option };

/**
 * Native select. Pass `options` (strings or `{ value, label, disabled }`) or
 * render `<option>` children directly; children render after `options`.
 */
const Select = ({
  variant = 'default',
  invalid = false,
  className,
  options,
  children,
  ...props
}) => (
  <select
    aria-invalid={invalid || undefined}
    {...props}
    className={fieldClass(variant, className)}
  >
    {options?.map((option) => {
      const { value, label, disabled } = toOption(option);
      return (
        <option key={value} value={value} disabled={disabled}>
          {label}
        </option>
      );
    })}
    {children}
  </select>
);

export default Select;
