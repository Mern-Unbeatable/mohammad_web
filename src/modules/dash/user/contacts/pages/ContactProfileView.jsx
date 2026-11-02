import { ContactProfilePageSkeleton } from '@/components/loader';
import ContactProfilePageContent from '@/components/data-display/ContactProfilePageContent/ContactProfilePageContent';
import { ReportPostModal } from '@/modules/dash/user/feed';
import NotFound from '@/modules/error/NotFound';
import { CHAT_BASE_PATHS, chatPath } from '@/features/messages/chatPaths';
import DashboardPage from '@/components/layout/DashboardPage';
import BackToDirectoryLink from '../components/profile/BackToDirectoryLink';
import { useContactProfile } from '../hooks/useContactProfile';

const ContactProfileView = () => {
  const profile = useContactProfile();
  const { contact } = profile;

  if (profile.notFound) return <NotFound />;

  if (profile.loading) {
    return (
      <DashboardPage width="7xl">
        <div className="mb-4 h-5 w-36 animate-pulse rounded-md bg-[#E4E7EC]" />
        <ContactProfilePageSkeleton />
      </DashboardPage>
    );
  }

  if (!contact) return <NotFound />;

  return (
    <>
      <DashboardPage width="7xl">
        <BackToDirectoryLink />

        <ContactProfilePageContent
          contact={contact}
          posts={profile.posts}
          postsLoading={profile.postsLoading}
          hasMorePosts={profile.hasMorePosts}
          loadingMorePosts={profile.loadingMorePosts}
          onLoadMorePosts={profile.loadMorePosts}
          onReport={profile.setReportPost}
          connected={contact.connected}
          onConnect={profile.connect}
          pending={contact.pending || profile.connecting}
          messageHref={chatPath(CHAT_BASE_PATHS.USER, { id: contact.id })}
          onMessage={profile.canMessage ? profile.openMessage : undefined}
        />
      </DashboardPage>

      <ReportPostModal
        open={Boolean(profile.reportPost)}
        post={profile.reportPost}
        onClose={profile.closeReport}
      />
    </>
  );
};

export default ContactProfileView;
