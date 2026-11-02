const Container = ({ as = 'div', className = '', children, ...props }) => {
  const Tag = as;
  return (
    <Tag
      className={`mx-auto w-full container px-4 sm:px-6 lg:px-8 ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Container;
