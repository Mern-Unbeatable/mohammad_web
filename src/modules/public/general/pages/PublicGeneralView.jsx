import Container from '@/components/ui/Container';
import GeneralPostCard from '@/components/data-display/GeneralPostCard/GeneralPostCard';
import Pagination from '@/components/common/Pagination/Pagination';
import { CardSkeleton } from '@/components/loader';
import DocumentMeta from '../components/DocumentMeta';
import GuestAuthPrompt from '../components/GuestAuthPrompt';
import GuestLoadMore from '../components/GuestLoadMore';
import PublicGeneralHero from '../components/PublicGeneralHero';
import {
  POSTS_GRID_CLASS,
  PUBLIC_GENERAL_PATH,
  PUBLIC_POSTS_PAGE_SIZE,
  publicGeneralPostPath,
} from '../constant/constants';
import { usePublicGeneralPosts } from '../hooks/usePublicGeneralPosts';

const PublicGeneralView = () => {
  const posts = usePublicGeneralPosts();

  return (
    <div className="flex-1">
      <DocumentMeta
        title="General Posts"
        description="Browse the latest laboratory news and documents shared on Lab Unity."
        canonicalPath={PUBLIC_GENERAL_PATH}
      />

      <PublicGeneralHero
        isAuthenticated={posts.isAuthenticated}
        category={posts.category}
        onCategoryChange={posts.onCategoryChange}
      />

      <section className="bg-[#F7F8FA] py-8 lg:py-10">
        <Container>
          {posts.guestLimited ? (
            <div className="mt-8">
              <GuestAuthPrompt
                title="You've reached the guest preview limit"
                message="Sign up or log in to keep reading General posts and join the conversation."
              />
            </div>
          ) : null}

          <div>
            {posts.loading ? (
              <CardSkeleton
                variant="generalPost"
                count={PUBLIC_POSTS_PAGE_SIZE}
                className={POSTS_GRID_CLASS}
              />
            ) : posts.error ? (
              <div className="rounded-xl border border-[#E4E7EC] bg-white px-6 py-10 text-center">
                <p className="text-[15px] font-medium text-deep-blue">
                  We couldn’t load posts right now
                </p>
                <p className="mt-1 text-[14px] text-[#667085]">{posts.error}</p>
                <button
                  type="button"
                  onClick={posts.retry}
                  className="mt-4 inline-flex rounded-full bg-primary px-5 py-2 text-[14px] font-semibold text-white hover:opacity-90"
                >
                  Try again
                </button>
              </div>
            ) : !posts.items.length ? (
              <div className="rounded-xl border border-[#E4E7EC] bg-white px-6 py-10 text-center">
                <p className="text-[15px] font-medium text-deep-blue">
                  No posts in this filter
                </p>
                <p className="mt-1 text-[14px] text-[#667085]">
                  Try All, or switch between News and Document.
                </p>
              </div>
            ) : (
              <>
                <div className="relative">
                  <div className={POSTS_GRID_CLASS}>
                    {posts.items.map((post) => (
                      <GeneralPostCard
                        key={post.id}
                        post={post}
                        detailHref={publicGeneralPostPath(post.id)}
                      />
                    ))}
                  </div>
                  {!posts.isAuthenticated ? <GuestLoadMore /> : null}
                </div>
                {posts.isAuthenticated && posts.totalPages > 1 ? (
                  <Pagination
                    page={posts.page}
                    totalPages={posts.totalPages}
                    onPageChange={posts.setPage}
                    className="mt-8"
                  />
                ) : null}
              </>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default PublicGeneralView;
