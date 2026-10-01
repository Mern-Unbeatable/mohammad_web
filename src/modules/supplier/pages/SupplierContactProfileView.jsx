import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import ContactProfilePageContent from "@/components/data-display/ContactProfilePageContent/ContactProfilePageContent";
import { ContactProfilePageSkeleton } from "@/components/common/Skeleton";
import ReportPostModal from "@/modules/user/components/feed/ReportPostModal";
import {
  fetchContactDetails,
  requestContactConnection,
  clearContactsError,
  clearSelectedContact,
  toContactProfileModel,
} from "@/features/supplier/contacts";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import NotFound from "@/shared/pages/NotFound";
import { CHAT_BASE_PATHS, chatPath } from "@/shared/constants/chat";

const SupplierContactProfileView = () => {
  const { contactId } = useParams();
  const dispatch = useDispatch();
  const {
    selectedContact,
    selectedContactLoading,
    connectingId,
    error,
  } = useSelector((state) => state.supplierContacts);

  const [reportPost, setReportPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!contactId) return undefined;
    dispatch(clearContactsError());
    dispatch(fetchContactDetails(contactId)).then((result) => {
      if (fetchContactDetails.rejected.match(result)) {
        setNotFound(true);
      }
    });
    return () => {
      dispatch(clearSelectedContact());
    };
  }, [dispatch, contactId]);

  useEffect(() => {
    if (error && !selectedContactLoading) toast.error(error);
  }, [error, selectedContactLoading]);

  if (notFound) return <NotFound />;

  if (selectedContactLoading || (!selectedContact && !error)) {
    return (
      <PanelPage>
        <ContactProfilePageSkeleton />
      </PanelPage>
    );
  }

  const contact = toContactProfileModel(selectedContact);
  if (!contact) return <NotFound />;

  const handleConnect = async () => {
    if (contact.connected || contact.pending || connectingId === contact.id) {
      return;
    }
    const result = await dispatch(requestContactConnection(contact.id));
    if (requestContactConnection.fulfilled.match(result)) {
      toast.success("Connection request sent");
    }
  };

  return (
    <>
      <PanelPage>
        <Link
          to="/supplier/contacts"
          className="inline-flex items-center gap-1.5 rounded-full px-1 py-1 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to directory
        </Link>

        <ContactProfilePageContent
          contact={contact}
          posts={[]}
          onReport={setReportPost}
          connected={contact.connected}
          pending={contact.pending || connectingId === contact.id}
          onConnect={handleConnect}
          messageHref={chatPath(CHAT_BASE_PATHS.SUPPLIER, { id: contact.id })}
        />
      </PanelPage>

      <ReportPostModal
        open={Boolean(reportPost)}
        post={reportPost}
        onClose={() => setReportPost(null)}
      />
    </>
  );
};

export default SupplierContactProfileView;
