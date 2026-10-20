import { ContactProfilePageSkeleton } from '@/components/common/Skeleton';
import ContactProfilePageContent from '@/components/data-display/ContactProfilePageContent/ContactProfilePageContent';
import { ReportPostModal } from '@/modules/dash/user/pages/feed';
import NotFound from '@/shared/pages/NotFound';
import { CHAT_BASE_PATHS, chatPath } from '@/shared/constants/chat';
import { StartConversationModal } from '@/modules/messages';
import ContactProfilePage from './components/profile/ContactProfilePage';
import BackToDirectoryLink from './components/profile/BackToDirectoryLink';
import { useContactProfile } from './hooks/useContactProfile';

const ContactProfileView = () => {
  const profile = useContactProfile();
  const { contact } = profile;

  if (profile.notFound) return <NotFound />;

  if (profile.loading) {
    return (
      <ContactProfilePage>
        <div className="mb-4 h-5 w-36 animate-pulse rounded-md bg-[#E4E7EC]" />
        <ContactProfilePageSkeleton />
      </ContactProfilePage>
    );
  }

  if (!contact) return <NotFound />;

  return (
    <>
      <ContactProfilePage>
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
      </ContactProfilePage>

      <StartConversationModal
        open={profile.messageOpen}
        title="New message"
        description={`Start a conversation with ${contact.name}.`}
        recipient={contact}
        onClose={profile.closeMessage}
        onSend={profile.sendMessage}
      />

      <ReportPostModal
        open={Boolean(profile.reportPost)}
        post={profile.reportPost}
        onClose={profile.closeReport}
      />
    </>
  );
};

export default ContactProfileView;
