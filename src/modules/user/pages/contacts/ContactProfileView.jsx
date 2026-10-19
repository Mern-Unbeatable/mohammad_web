import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import Container from "@/components/ui/Container";
import { ContactProfilePageSkeleton } from "@/components/common/Skeleton";
import ContactProfilePageContent from "@/components/data-display/ContactProfilePageContent/ContactProfilePageContent";
import { ReportPostModal } from "@/modules/user/pages/feed";
import {
  fetchContactDetails,
  requestContactConnection,
  clearContactsError,
  clearSelectedContact,
  toContactProfileModel,
} from "@/features/user/contacts";
import { fetchAuthorPosts, toFeedPostModel } from "@/features/user/feed";
import NotFound from "@/shared/pages/NotFound";
import { useAuth } from "@/shared/auth/useAuth";
import { CHAT_BASE_PATHS, chatPath } from "@/shared/constants/chat";
import StartConversationModal from "@/shared/pages/messages/StartConversationModal";
import { useStartConversation } from "@/shared/pages/messages/useStartConversation";

const ContactProfileView = () => {
  const { contactId } = useParams();
  const dispatch = useDispatch();
  const { selectedContact, selectedContactLoading, connectingId, error } =
    useSelector((state) => state.userContacts);
  const {
    authorPosts,
    authorPostsAuthorId,
    authorPostsMeta,
    authorPostsLoading,
    authorPostsLoadingMore,
    authorPostsError,
  } = useSelector((state) => state.userFeed);

  const { user } = useAuth();
  const startConversation = useStartConversation(CHAT_BASE_PATHS.USER);
  const [reportPost, setReportPost] = useState(null);
  const [notFoundId, setNotFoundId] = useState(null);
  /** Contact id the message dialog is open for. */
  const [messageContactId, setMessageContactId] = useState(null);
  const closeMessage = useCallback(() => setMessageContactId(null), []);

  useEffect(() => {
    if (!contactId) return undefined;
    dispatch(clearContactsError());
    dispatch(fetchContactDetails(contactId)).then((result) => {
      if (fetchContactDetails.rejected.match(result)) {
        setNotFoundId(contactId);
      }
    });
    return () => {
      dispatch(clearSelectedContact());
    };
  }, [dispatch, contactId]);

  useEffect(() => {
    if (contactId) dispatch(fetchAuthorPosts({ authorId: contactId }));
  }, [dispatch, contactId]);

  useEffect(() => {
    if (error && !selectedContactLoading) toast.error(error);
  }, [error, selectedContactLoading]);

  const hasContact = Boolean(selectedContact);
  useEffect(() => {
    if (authorPostsError && hasContact) toast.error(authorPostsError);
  }, [authorPostsError, hasContact]);

  const isThisAuthor = authorPostsAuthorId === contactId;
  const posts = useMemo(
    () =>
      isThisAuthor
        ? (authorPosts || []).map(toFeedPostModel).filter(Boolean)
        : [],
    [authorPosts, isThisAuthor],
  );
  const hasMorePosts =
    isThisAuthor &&
    (authorPostsMeta?.page ?? 1) < (authorPostsMeta?.totalPages ?? 1);

  if (notFoundId === contactId) return <NotFound />;

  if (selectedContactLoading || (!selectedContact && !error)) {
    return (
      <main className="pt-6 pb-5 sm:pt-8 sm:pb-8">
        <Container className="max-w-7xl">
          <div className="mb-4 h-5 w-36 animate-pulse rounded-md bg-[#E4E7EC]" />
          <ContactProfilePageSkeleton />
        </Container>
      </main>
    );
  }

  const contact = toContactProfileModel(selectedContact);
  if (!contact) return <NotFound />;

  const canMessage = Boolean(contact.id && user?.id && contact.id !== user.id);

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
      <main className="pt-6 pb-5 sm:pt-8 sm:pb-8">
        <Container className="max-w-7xl">
          <Link
            to="/contacts"
            className="mb-4 inline-flex items-center gap-1.5 rounded-full px-1 py-1 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to directory
          </Link>

          <ContactProfilePageContent
            contact={contact}
            posts={posts}
            postsLoading={!isThisAuthor || authorPostsLoading}
            hasMorePosts={hasMorePosts}
            loadingMorePosts={authorPostsLoadingMore}
            onLoadMorePosts={() =>
              dispatch(
                fetchAuthorPosts({
                  authorId: contactId,
                  page: (authorPostsMeta?.page ?? 1) + 1,
                }),
              )
            }
            onReport={setReportPost}
            connected={contact.connected}
            onConnect={handleConnect}
            pending={contact.pending || connectingId === contact.id}
            messageHref={chatPath(CHAT_BASE_PATHS.USER, { id: contact.id })}
            onMessage={canMessage ? () => setMessageContactId(contact.id) : undefined}
          />
        </Container>
      </main>

      <StartConversationModal
        open={canMessage && messageContactId === contact.id}
        title="New message"
        description={`Start a conversation with ${contact.name}.`}
        recipient={contact}
        onClose={closeMessage}
        onSend={(message) => startConversation({ recipientId: contact.id, message })}
      />

      <ReportPostModal
        open={Boolean(reportPost)}
        post={reportPost}
        onClose={() => setReportPost(null)}
      />
    </>
  );
};

export default ContactProfileView;
