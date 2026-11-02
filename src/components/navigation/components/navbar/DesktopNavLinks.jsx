import { Link } from "react-router";
import CountBadge from "@/components/ui/CountBadge";
import { NAV_ITEMS } from "../../constant/constants";
import { isNavItemActive } from "@/shared/utils/nav/navActive";
import NotificationsHoverMenu from "../menus/NotificationsHoverMenu";
import MessagesHoverMenu from "../menus/MessagesHoverMenu";

/** Icon + label links; Notifications and Messages open a preview on hover. */
const DesktopNavLinks = ({ pathname, badgeFor, badgeLabelFor }) => (
  <nav className="flex gap-0.5 self-stretch">
    {NAV_ITEMS.map((item) => {
      const { id, label, to } = item;
      const active = isNavItemActive(item, pathname);
      const link = (
        <Link
          key={id}
          to={to}
          aria-current={active ? "page" : undefined}
          className={`relative flex h-full min-w-[68px] flex-col items-center justify-center gap-0.5 px-2 text-[11px] font-medium transition-colors after:absolute after:inset-x-1 after:-bottom-px after:h-[2px] after:rounded-full after:transition-colors ${
            active
              ? "text-primary after:bg-primary"
              : "text-[#64748B] after:bg-transparent hover:bg-[#F9FAFB] hover:text-deep-blue"
          }`}
        >
          <span className="relative">
            <item.icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
            <CountBadge
              count={badgeFor(id)}
              label={badgeLabelFor(id)}
              className="absolute -right-2.5 -top-1.5"
            />
          </span>
          <span>{label}</span>
        </Link>
      );
      if (id === "notifications") {
        return (
          <NotificationsHoverMenu key={id}>{link}</NotificationsHoverMenu>
        );
      }
      if (id === "messages") {
        return <MessagesHoverMenu key={id}>{link}</MessagesHoverMenu>;
      }
      return link;
    })}
  </nav>
);

export default DesktopNavLinks;
