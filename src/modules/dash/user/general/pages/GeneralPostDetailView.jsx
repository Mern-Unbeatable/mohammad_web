import { Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { GeneralPostDetailSkeleton } from '@/components/loader';
import NotFound from '@/modules/error/NotFound';
import DashboardPage from '@/components/layout/DashboardPage';
import { useAuth } from '@/modules/auth';
import GeneralPostHeader from '../components/detail/GeneralPostHeader';
import GeneralPostBody from '../components/detail/GeneralPostBody';
import PostActions from '../components/detail/PostActions';
import { JobPosterCard } from '@/modules/dash/user/recruitment';
import RelatedPosts from '../components/detail/RelatedPosts';
import { useGeneralPostDetail } from '../hooks/useGeneralPostDetail';
import { useRelatedGeneralPosts } from '../hooks/useRelatedGeneralPosts';
import { GENERAL_PATH } from '../constant/constants';

const GeneralPostDetailView = () => {
  const { notFound, loading, post, share } = useGeneralPostDetail();
  const related = useRelatedGeneralPosts(post);
  const { user } = useAuth();

  if (notFound) return <NotFound />;

  if (loading) {
    return (
      <DashboardPage width="narrow">
        <GeneralPostDetailSkeleton />
      </DashboardPage>
    );
  }

  if (!post) return <NotFound />;

  return (
    <DashboardPage>
      <Link
        to={GENERAL_PATH}
        className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to General
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
        <article className="min-w-0">
          <GeneralPostHeader post={post} />
          <GeneralPostBody body={post.body} summary={post.summary} />
          <PostActions post={post} onShare={share} />
        </article>

        <aside className="space-y-4 lg:sticky lg:top-[78px] lg:self-start">
          <JobPosterCard
            owner={post.author}
            isSelf={Boolean(user?.id) && post.author?.id === user.id}
          />
          <RelatedPosts loading={related.loading} items={related.items} />
        </aside>
      </div>
    </DashboardPage>
  );
};

export default GeneralPostDetailView;
