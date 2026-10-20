import Container from "@/components/ui/Container";
import { dashboardPageSpacing, dashboardPageWidths } from "./dashboardPageTheme";

/**
 * Page frame for user-dashboard routes. `UserLayout` owns the `<main>`
 * landmark, so this renders a plain block. `className` styles the inner
 * container (e.g. a page-level grid or flex row). Full-width pages such as
 * the blog hub render their own sections instead of using this frame.
 */
const DashboardPage = ({ width = "container", spacing = "default", className = "", children }) => (
  <div className={dashboardPageSpacing[spacing]}>
    <Container className={`${dashboardPageWidths[width]} ${className}`.trim()}>{children}</Container>
  </div>
);

export default DashboardPage;
