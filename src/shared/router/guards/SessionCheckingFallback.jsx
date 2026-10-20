/** Shown by route guards until the auth session has been revalidated. */
const SessionCheckingFallback = ({ label = 'Checking session…' }) => (
  <div className="flex min-h-[40vh] items-center justify-center text-sm text-[#64748B]">
    {label}
  </div>
);

export default SessionCheckingFallback;
