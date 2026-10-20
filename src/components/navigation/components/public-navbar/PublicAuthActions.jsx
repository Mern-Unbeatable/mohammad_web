import { Link } from 'react-router';
import { Loader2 } from 'lucide-react';
import { usePublicAuthActions } from '../../hooks/usePublicAuthActions';
import { FEED_PATH, LOGIN_PATH, PUBLIC_PRIMARY_LINK_CLASS } from '../../constant/constants';

/** Log in / Join for guests; Log out + Dashboard (supplier, admin) or Feed (user) when signed in. */
const PublicAuthActions = ({ onNavigate, className = '' }) => {
  const { isAuthenticated, isSupplierOrAdmin, homePath, loggingOut, handleLogout } =
    usePublicAuthActions({ onNavigate });

  if (isAuthenticated) {
    return (
      <div className={className}>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          aria-busy={loggingOut}
          className="inline-flex items-center gap-1.5 text-[15px] font-normal leading-none text-deep-blue transition-colors hover:text-primary disabled:cursor-wait disabled:opacity-70 xl:text-[16px]"
        >
          {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loggingOut ? 'Logging out…' : 'Log out'}
        </button>
        {isSupplierOrAdmin ? (
          <Link to={homePath} onClick={onNavigate} className={PUBLIC_PRIMARY_LINK_CLASS}>
            Dashboard
          </Link>
        ) : (
          <Link to={FEED_PATH} onClick={onNavigate} className={PUBLIC_PRIMARY_LINK_CLASS}>
            Feed
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <Link
        to={LOGIN_PATH}
        onClick={onNavigate}
        className="text-[15px] font-normal leading-none text-deep-blue transition-colors hover:text-primary xl:text-[16px]"
      >
        Log in
      </Link>
      <Link to="/join" onClick={onNavigate} className={PUBLIC_PRIMARY_LINK_CLASS}>
        Join Lab Unity
      </Link>
    </div>
  );
};

export default PublicAuthActions;
