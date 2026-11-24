const MetaLine = ({ icon, children, className = "" }) => {
  const Icon = icon;
  return (
    <span className={`inline-flex min-w-0 items-center gap-1 ${className}`}>
      <Icon aria-hidden className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{children}</span>
    </span>
  );
};

export default MetaLine;
