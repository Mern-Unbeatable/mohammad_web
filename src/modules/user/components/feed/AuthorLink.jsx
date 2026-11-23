import { useSelector } from "react-redux";
import { Link } from "react-router";
import { authorProfileHref } from "./authorProfileHref";

/**
 * Wraps an author's avatar or name in a link to their profile. Pass `decorative`
 * for the avatar so keyboard and screen-reader users get one link per author.
 */
const AuthorLink = ({ author, decorative = false, className = "", children }) => {
  const viewerId = useSelector((state) => state.userProfile.user?.id);
  const href = authorProfileHref(author?.id, viewerId);

  if (!href) return <span className={className}>{children}</span>;

  return (
    <Link
      to={href}
      className={className}
      {...(decorative
        ? { tabIndex: -1, "aria-hidden": true }
        : { title: `View ${author.name}'s profile` })}
    >
      {children}
    </Link>
  );
};

export default AuthorLink;
