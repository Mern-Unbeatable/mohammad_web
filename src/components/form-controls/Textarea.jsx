import { fieldClass } from './formStyles';

const Textarea = ({ variant = 'default', invalid = false, className, ...props }) => (
  <textarea
    aria-invalid={invalid || undefined}
    {...props}
    className={fieldClass(variant, className)}
  />
);

export default Textarea;
