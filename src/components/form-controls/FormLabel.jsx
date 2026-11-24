import { labelClass } from './formStyles';

/** Use `as="p"` for captions that title a group without a single control. */
const FormLabel = ({
  as = 'label',
  variant = 'default',
  required = false,
  className,
  children,
  ...props
}) => {
  const Tag = as;
  return (
    <Tag {...props} className={labelClass(variant, className)}>
      {children}
      {required ? (
        <span className="text-pink-light" aria-hidden="true">
          {' '}
          *
        </span>
      ) : null}
    </Tag>
  );
};

export default FormLabel;
