import { Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { GeneralPostDetailSkeleton } from '@/components/loader';
import NotFound from '@/modules/error/NotFound';
import DashboardPage from '@/components/layout/DashboardPage';
import GeneralPostHeader from '../components/detail/GeneralPostHeader';
import GeneralPostBody from '../components/detail/GeneralPostBody';
import PostActions from '../components/detail/PostActions';
import { useGeneralPostDetail } from '../hooks/useGeneralPostDetail';
import { GENERAL_PATH } from '../constant/constants';

const GeneralPostDetailView = () => {
  const { notFound, loading, post, share } = useGeneralPostDetail();

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
    <DashboardPage width="narrow">
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
    </DashboardPage>
  );
};

export default GeneralPostDetailView;
