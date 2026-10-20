/** Shown by route guards until the auth session has been revalidated. */
const SessionCheckingFallback = () => (
  <div className="flex min-h-[40vh] items-center justify-center text-sm text-[#64748B]">
    Checking session…
  </div>
);

export default SessionCheckingFallback;
