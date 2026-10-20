import Container from '@/components/ui/Container';

/** Narrow page frame shared by the detail page and its loading state. */
const BlogDetailPage = ({ children }) => (
  <main>
    <div className="py-5 sm:py-8">
      <Container className="max-w-[960px]">{children}</Container>
    </div>
  </main>
);

export default BlogDetailPage;
