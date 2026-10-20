import Container from "@/components/ui/Container";
import { BLEED_CLASS } from "../../constant/constants";

/** Narrow page frame shared by the detail page and its loading state. */
const BlogDetailPage = ({ children }) => (
  <div className={BLEED_CLASS}>
    <div className="py-5 sm:py-8">
      <Container className="max-w-[960px]">{children}</Container>
    </div>
  </div>
);

export default BlogDetailPage;
