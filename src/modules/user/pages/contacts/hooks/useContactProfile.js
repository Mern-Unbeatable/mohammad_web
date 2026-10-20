import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  fetchContactDetails,
  requestContactConnection,
  clearContactsError,
  clearSelectedContact,
  toContactProfileModel,
} from '@/features/user/contacts';
import { fetchAuthorPosts, toFeedPostModel } from '@/features/user/feed';
import { useAuth } from '@/shared/auth/useAuth';
import { CHAT_BASE_PATHS } from '@/shared/constants/chat';
import { useStartConversation } from '@/shared/pages/messages/useStartConversation';

/** Contact profile: details, the contact's posts, connect, message and report state. */
export const useContactProfile = () => {
  const { contactId } = useParams();
  const dispatch = useDispatch();
  const { selectedContact, selectedContactLoading, connectingId, error } = useSelector(
    (state) => state.userContacts,
  );
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
      if (fetchContactDetails.rejected.match(result)) setNotFoundId(contactId);
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
    () => (isThisAuthor ? (authorPosts || []).map(toFeedPostModel).filter(Boolean) : []),
    [authorPosts, isThisAuthor],
  );
  const postsPage = authorPostsMeta?.page ?? 1;
  const hasMorePosts = isThisAuthor && postsPage < (authorPostsMeta?.totalPages ?? 1);

  const loading = selectedContactLoading || (!selectedContact && !error);
  const contact = loading ? null : toContactProfileModel(selectedContact);
  const canMessage = Boolean(contact?.id && user?.id && contact.id !== user.id);

  const connect = async () => {
    if (contact.connected || contact.pending || connectingId === contact.id) return;
    const result = await dispatch(requestContactConnection(contact.id));
    if (requestContactConnection.fulfilled.match(result)) {
      toast.success('Connection request sent');
    }
  };

  return {
    notFound: notFoundId === contactId,
    loading,
    contact,
    posts,
    postsLoading: !isThisAuthor || authorPostsLoading,
    hasMorePosts,
    loadingMorePosts: authorPostsLoadingMore,
    loadMorePosts: () =>
      dispatch(fetchAuthorPosts({ authorId: contactId, page: postsPage + 1 })),
    connect,
    connecting: Boolean(contact) && connectingId === contact.id,
    canMessage,
    messageOpen: canMessage && messageContactId === contact.id,
    openMessage: () => setMessageContactId(contact.id),
    closeMessage,
    sendMessage: (message) => startConversation({ recipientId: contact.id, message }),
    reportPost,
    setReportPost,
    closeReport: () => setReportPost(null),
  };
};
