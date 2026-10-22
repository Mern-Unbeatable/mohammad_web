import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";

const baseClass =
  "group inline-flex items-center gap-2.5 rounded-full text-[13px] font-semibold text-deep-blue transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 sm:text-[14px]";

const BackIcon = () => (
  <span
    aria-hidden="true"
    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3BA3E6] to-primary text-white shadow-md shadow-primary/25 transition-transform group-hover:-translate-x-0.5"
  >
    <ChevronLeft className="h-4 w-4" strokeWidth={3} />
  </span>
);

/** Round "back" control used at the top of detail and form pages; a link with `to`, a button with `onClick`. */
const BackLink = ({ to, onClick, children = "Back", className = "" }) => {
  const classes = `${baseClass} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes}>
        <BackIcon />
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      <BackIcon />
      {children}
    </button>
  );
};

export default BackLink;
