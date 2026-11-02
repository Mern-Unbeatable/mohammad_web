import ContactProfilePageContent from "@/components/data-display/ContactProfilePageContent/ContactProfilePageContent";
import { ContactProfilePageSkeleton } from "@/components/loader";
import PanelPage from "@/components/layout/PanelPage";
import { ReportPostModal } from "@/modules/dash/user/feed";
import NotFound from "@/modules/error/NotFound";
import { CHAT_BASE_PATHS, chatPath } from "@/features/messages/chatPaths";
import BackToDirectoryLink from "../components/profile/BackToDirectoryLink";
import { useContactProfile } from "../hooks/useContactProfile";

const SupplierContactProfileView = () => {
  const profile = useContactProfile();
  const { contact } = profile;

  if (profile.notFound) return <NotFound />;

  if (profile.loading) {
    return (
      <PanelPage>
        <ContactProfilePageSkeleton />
      </PanelPage>
    );
  }

  if (!contact) return <NotFound />;

  return (
    <>
      <PanelPage>
        <BackToDirectoryLink />

        <ContactProfilePageContent
          contact={contact}
          posts={[]}
          onReport={profile.setReportPost}
          connected={contact.connected}
          pending={contact.pending || profile.connecting}
          onConnect={profile.connect}
          messageHref={chatPath(CHAT_BASE_PATHS.SUPPLIER, { id: contact.id })}
        />
      </PanelPage>

      <ReportPostModal
        open={Boolean(profile.reportPost)}
        post={profile.reportPost}
        onClose={profile.closeReport}
      />
    </>
  );
};

export default SupplierContactProfileView;
