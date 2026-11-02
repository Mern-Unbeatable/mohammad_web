import { CHECKBOX_CLASS, withClass } from './formStyles';

const Checkbox = ({ className, ...props }) => (
  <input type="checkbox" {...props} className={withClass(CHECKBOX_CLASS, className)} />
);

export default Checkbox;
