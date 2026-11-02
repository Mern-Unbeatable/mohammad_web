const ErrorBanner = ({ children }) => (
  <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
    {children}
  </p>
);

export default ErrorBanner;
