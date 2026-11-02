import { fieldClass } from './formStyles';

const Input = ({ variant = 'default', invalid = false, className, type = 'text', ...props }) => (
  <input
    type={type}
    aria-invalid={invalid || undefined}
    {...props}
    className={fieldClass(variant, className)}
  />
);

export default Input;
