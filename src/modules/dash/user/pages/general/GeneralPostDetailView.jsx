import { Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { GeneralPostDetailSkeleton } from '@/components/common/Skeleton';
import NotFound from '@/shared/pages/NotFound';
import GeneralPage from './components/layout/GeneralPage';
import GeneralPostHeader from './components/detail/GeneralPostHeader';
import GeneralPostBody from './components/detail/GeneralPostBody';
import PostActions from './components/detail/PostActions';
import { useGeneralPostDetail } from './hooks/useGeneralPostDetail';
import { GENERAL_PATH } from './constant/constants';

const CONTAINER_CLASS = 'max-w-[760px]';

const GeneralPostDetailView = () => {
  const { notFound, loading, post, share } = useGeneralPostDetail();

  if (notFound) return <NotFound />;

  if (loading) {
    return (
      <GeneralPage containerClassName={CONTAINER_CLASS}>
        <GeneralPostDetailSkeleton />
      </GeneralPage>
    );
  }

  if (!post) return <NotFound />;

  return (
    <GeneralPage containerClassName={CONTAINER_CLASS}>
      <Link
        to={GENERAL_PATH}
        className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to General
      </Link>

      <GeneralPostHeader post={post} />
      <GeneralPostBody body={post.body} summary={post.summary} />
      <PostActions post={post} onShare={share} />
    </GeneralPage>
  );
};

export default GeneralPostDetailView;
