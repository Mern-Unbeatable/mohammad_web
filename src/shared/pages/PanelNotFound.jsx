import { Link } from 'react-router';
import { useAuth } from '@/shared/auth/useAuth';

const PanelNotFound = () => {
  const { homePath } = useAuth();

  return (
    <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-white p-10 text-center">
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-primary">404</p>
      <h2 className="mt-3 text-[22px] font-bold text-deep-blue">Page not found</h2>
      <p className="mx-auto mt-2 max-w-md text-[14px] text-[#64748B]">
        This panel URL does not exist or has been moved.
      </p>
      <Link
        to={homePath}
        className="mt-6 inline-flex rounded-md bg-primary px-5 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
      >
        Back to dashboard
      </Link>
    </div>
  );
};

export default PanelNotFound;
