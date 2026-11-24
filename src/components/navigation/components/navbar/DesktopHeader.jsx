import { Link } from "react-router";
import logo from "@/assets/logo.png";
import Container from "@/components/ui/Container";
import ProfileDropdown from "../menus/ProfileDropdown";
import NavSearchField from "./NavSearchField";
import DesktopNavLinks from "./DesktopNavLinks";

const DesktopHeader = ({ search, pathname, badgeFor, badgeLabelFor }) => (
  <Container className="hidden h-[62px] items-center gap-4 xl:flex xl:gap-6">
    <Link to="/" className="flex shrink-0 items-center gap-2">
      <img src={logo} alt="Lab Unity" className="h-8 w-auto" />
      <span className="text-[17px] font-bold text-deep-blue">
        Lab Unity
      </span>
    </Link>

    <NavSearchField
      containerRef={search.desktopSearchRef}
      className="relative mx-auto max-w-[420px] flex-1"
      iconClassName="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]"
      inputClassName="h-9 w-full rounded-full border border-[#E4E7EC] bg-[#F9FAFB] pl-10 pr-4 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10"
      placeholder="Search professionals, products, jobs..."
      field={search.field}
      dropdown={search.dropdown}
    />

    <DesktopNavLinks
      pathname={pathname}
      badgeFor={badgeFor}
      badgeLabelFor={badgeLabelFor}
    />

    <div
      className="mx-1 h-8 w-px shrink-0 bg-[#E4E7EC]"
      aria-hidden="true"
    />

    <ProfileDropdown />
  </Container>
);

export default DesktopHeader;
