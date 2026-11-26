import BackLink from "@/components/layout/BackLink";
import Container from "@/components/ui/Container";
import NotFound from "@/modules/error/NotFound";
import GeneralPostHeader from "@/modules/dash/user/general/components/detail/GeneralPostHeader";
import GeneralPostBody from "@/modules/dash/user/general/components/detail/GeneralPostBody";
import PostActions from "@/modules/dash/user/general/components/detail/PostActions";
import RelatedPosts from "@/modules/dash/user/general/components/detail/RelatedPosts";
import { JobPosterCard } from "@/modules/dash/user/recruitment";
import DocumentMeta from "../components/DocumentMeta";
import GuestAuthPrompt from "../components/GuestAuthPrompt";
import GuestConversationPrompt from "../components/GuestConversationPrompt";
import GuestSignInCard from "../components/GuestSignInCard";
import PublicGeneralPostDetailSkeleton from "../components/PublicGeneralPostDetailSkeleton";
import {
  PUBLIC_GENERAL_PATH,
  publicGeneralPostPath,
} from "../constant/constants";
import { usePublicGeneralPostDetail } from "../hooks/usePublicGeneralPostDetail";

const PublicGeneralPostDetailView = () => {
  const detail = usePublicGeneralPostDetail();

  if (detail.notFound) return <NotFound />;

  if (detail.guestBlocked) {
    return (
      <section className="flex-1 bg-[#F7F8FA] py-10 lg:py-14">
        <DocumentMeta
          title="Sign in to keep reading"
          description="Create a Lab Unity account or log in to continue browsing General posts."
          canonicalPath={publicGeneralPostPath(detail.postId)}
          noindex
        />
        <Container className="max-w-3xl">
          <BackLink to={PUBLIC_GENERAL_PATH} className="mb-5">
            Back to General
          </BackLink>
          <GuestAuthPrompt
            title="You've reached the guest preview limit"
            message="Sign up or log in to keep reading General posts and join the conversation."
          />
        </Container>
      </section>
    );
  }

  if (detail.loading) {
    return (
      <section className="flex-1 bg-[#F7F8FA] py-6 lg:py-8">
        <Container>
          <PublicGeneralPostDetailSkeleton
            showSignInCard={!detail.isAuthenticated}
          />
        </Container>
      </section>
    );
  }

  if (!detail.post) return <NotFound />;

  const description =
    detail.post.summary ||
    (Array.isArray(detail.post.body) ? detail.post.body[0] : "") ||
    "General post on Lab Unity";

  return (
    <section className="flex-1 bg-[#F7F8FA] py-6 lg:py-8">
      <DocumentMeta
        title={detail.post.title}
        description={description}
        canonicalPath={publicGeneralPostPath(detail.post.id)}
        image={detail.post.image}
        type="article"
      />

      <Container>
        <BackLink to={PUBLIC_GENERAL_PATH} className="mb-5">
          Back to General
        </BackLink>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
          <article className="min-w-0 rounded-2xl border border-[#E4E7EC] bg-white p-5 sm:p-7">
            <GeneralPostHeader post={detail.post} />
            <GeneralPostBody
              body={detail.post.body}
              summary={detail.post.summary}
            />
            <PostActions post={detail.post} onShare={detail.share} />
            {detail.isAuthenticated ? null : <GuestConversationPrompt />}
          </article>

          <aside className="space-y-4 lg:sticky lg:top-[90px] lg:self-start">
            <JobPosterCard
              owner={detail.post.author}
              isSelf={
                Boolean(detail.user?.id) &&
                detail.post.author?.id === detail.user.id
              }
              profileHref={detail.isAuthenticated ? undefined : null}
            />
            {detail.isAuthenticated ? null : <GuestSignInCard />}
            <RelatedPosts
              loading={false}
              items={detail.related}
              getPostPath={publicGeneralPostPath}
            />
          </aside>
        </div>
      </Container>
    </section>
  );
};

export default PublicGeneralPostDetailView;
