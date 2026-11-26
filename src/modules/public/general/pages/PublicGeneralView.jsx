import { Link } from "react-router";
import Container from "@/components/ui/Container";
import GeneralPostCard from "@/components/data-display/GeneralPostCard/GeneralPostCard";
import Pagination from "@/components/common/Pagination/Pagination";
import { CardSkeleton } from "@/components/loader";
import CategoryPills from "../components/CategoryPills";
import DocumentMeta from "../components/DocumentMeta";
import GuestAuthPrompt from "../components/GuestAuthPrompt";
import GuestLoadMore from "../components/GuestLoadMore";
import {
  POSTS_GRID_CLASS,
  PUBLIC_GENERAL_PATH,
  PUBLIC_POSTS_PAGE_SIZE,
  publicGeneralPostPath,
} from "../constant/constants";
import { usePublicGeneralPosts } from "../hooks/usePublicGeneralPosts";

const PublicGeneralView = () => {
  const posts = usePublicGeneralPosts();

  return (
    <section className="flex-1 bg-[#F7F8FA] py-10 lg:py-14">
      <DocumentMeta
        title="General Posts"
        description="Browse the latest laboratory news and documents shared on Lab Unity."
        canonicalPath={PUBLIC_GENERAL_PATH}
      />

      <Container>
        <header className="max-w-3xl">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-primary">
            Community
          </p>
          <h1 className="mt-2 text-[28px] font-bold text-deep-blue sm:text-[32px]">
            General
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-[#667085]">
            News and documents from the Lab Unity community. Guests can preview
            a limited selection; members get full access.
          </p>
        </header>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <CategoryPills
            value={posts.category}
            onChange={posts.onCategoryChange}
          />
          {posts.isAuthenticated ? (
            <Link
              to="/general"
              className="text-[13px] font-semibold text-primary hover:underline"
            >
              Open member General
            </Link>
          ) : null}
        </div>

        {posts.guestLimited ? (
          <div className="mt-8">
            <GuestAuthPrompt
              title="You've reached the guest preview limit"
              message="Sign up or log in to keep reading General posts and join the conversation."
            />
          </div>
        ) : null}

        <div className="mt-8">
          {posts.loading ? (
            <CardSkeleton
              variant="generalPost"
              count={PUBLIC_POSTS_PAGE_SIZE}
              className={POSTS_GRID_CLASS}
            />
          ) : posts.error ? (
            <div className="rounded-xl border border-[#E4E7EC] bg-white px-6 py-10 text-center">
              <p className="text-[14px] text-[#667085]">{posts.error}</p>
              <button
                type="button"
                onClick={posts.retry}
                className="mt-3 text-[14px] font-semibold text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : !posts.items.length ? (
            <div className="rounded-xl border border-[#E4E7EC] bg-white px-6 py-10 text-center text-[14px] text-[#667085]">
              No General posts to show yet.
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
        {/* 
        {!posts.isAuthenticated && !posts.loading && posts.items.length ? (
          <div className="mt-8">
            <GuestAuthPrompt
              title="Sign in to keep exploring"
              message="Create a free account or log in to browse more General posts and join the conversation."
              compact
            />
          </div>
        ) : null} */}
      </Container>
    </section>
  );
};

export default PublicGeneralView;
