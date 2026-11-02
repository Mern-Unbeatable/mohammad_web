import { AlertCircle } from 'lucide-react';
import { withClass, ERROR_CLASS } from './formStyles';

const FormError = ({ id, className, children }) => {
  if (!children) return null;
  return (
    <p id={id} role="alert" className={withClass(ERROR_CLASS, className)}>
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
};

export default FormError;
