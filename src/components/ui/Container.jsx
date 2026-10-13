const Container = ({ as: Tag = 'div', className = '', children, ...props }) => (
  <Tag
    className={`mx-auto w-full container px-4 sm:px-6 lg:px-8 ${className}`.trim()}
    {...props}
  >
    {children}
  </Tag>
);

export default Container;
