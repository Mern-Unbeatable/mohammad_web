import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { toast } from "react-hot-toast";
import { CHAT_BASE_PATHS, chatPath } from "@/features/messages/chatPaths";
import { useAuth } from "@/modules/auth";
import { useStartConversation } from "@/modules/messages";
import {
  clearSelectedUser,
  fetchUserDetails,
  updateUserStatus,
  usersApi,
} from "@/features/dash/admin/users";
import { toProfilePageUser } from "@/features/dash/user/profile";
import { fetchAuthorPosts, toFeedPostModel } from "@/features/dash/user/feed";
import { contentKindsFor, isSupplierUser } from "../utils/userDetail";
import { ACTIVATE_REASON, API_STATUS, MESSAGES } from "../constant/constants";

/**
 * Admin view of one user: details, their posts (feed slice), their ads /
 * listings / jobs (cached per user id), status changes and the message dialog.
 */
export const useAdminUserDetail = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { user: authUser } = useAuth();
  const startConversation = useStartConversation(CHAT_BASE_PATHS.ADMIN);

  const { selectedUser, selectedUserLoading, error } = useSelector((state) => state.adminUsers);
  const {
    authorPosts,
    authorPostsAuthorId,
    authorPostsMeta,
    authorPostsLoading,
    authorPostsLoadingMore,
  } = useSelector((state) => state.userFeed);

  const [suspendOpen, setSuspendOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [contentCache, setContentCache] = useState({ key: null, data: null });
  /** User id the message dialog is open for. */
  const [messageUserId, setMessageUserId] = useState(null);
  const closeMessage = useCallback(() => setMessageUserId(null), []);

  const userLoaded = selectedUser?.id === userId;

  useEffect(() => {
    if (!userLoaded) return undefined;
    let cancelled = false;
    usersApi
      .getUserContent(userId)
      .then((data) => {
        if (!cancelled) setContentCache({ key: userId, data });
      })
      .catch(() => {
        if (!cancelled) setContentCache({ key: userId, data: null });
      });
    return () => {
      cancelled = true;
    };
  }, [userLoaded, userId]);

  useEffect(() => {
    if (userId) dispatch(fetchUserDetails(userId));
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [dispatch, userId]);

  useEffect(() => {
    if (userId) dispatch(fetchAuthorPosts({ authorId: userId }));
  }, [dispatch, userId]);

  const profileUser = useMemo(() => toProfilePageUser(selectedUser), [selectedUser]);

  const isThisAuthor = authorPostsAuthorId === userId;
  const posts = useMemo(
    () => (isThisAuthor ? (authorPosts || []).map(toFeedPostModel).filter(Boolean) : []),
    [authorPosts, isThisAuthor],
  );

  const changeStatus = async (status, reason) => {
    if (updatingStatus) return;
    setUpdatingStatus(true);
    const result = await dispatch(updateUserStatus({ userId, status, reason }));
    setUpdatingStatus(false);
    if (updateUserStatus.fulfilled.match(result)) {
      toast.success(status === API_STATUS.SUSPENDED ? MESSAGES.SUSPENDED : MESSAGES.ACTIVATED);
    } else {
      toast.error(result.payload || MESSAGES.UPDATE_FAILED);
    }
  };

  const contentLoading = contentCache.key !== userId;
  const canMessage = Boolean(userId && authUser?.id && userId !== authUser.id);

  let status = "ready";
  if (selectedUserLoading || (!selectedUser && !error)) status = "loading";
  else if (error || !profileUser) status = "error";

  return {
    status,
    errorMessage: error || "User details not found",
    selectedUser,
    profileUser,
    posts: {
      items: posts,
      loading: !isThisAuthor || authorPostsLoading,
      hasMore: isThisAuthor && (authorPostsMeta?.page ?? 1) < (authorPostsMeta?.totalPages ?? 1),
      loadingMore: authorPostsLoadingMore,
      loadMore: () =>
        dispatch(fetchAuthorPosts({ authorId: userId, page: (authorPostsMeta?.page ?? 1) + 1 })),
      total: isThisAuthor && !authorPostsLoading ? (authorPostsMeta?.total ?? posts.length) : "…",
    },
    content: {
      data: contentLoading ? null : contentCache.data,
      loading: contentLoading,
      kinds: contentKindsFor(userLoaded && isSupplierUser(selectedUser)),
    },
    account: {
      updating: updatingStatus,
      suspendOpen,
      openSuspend: () => setSuspendOpen(true),
      closeSuspend: () => setSuspendOpen(false),
      suspend: (reason) => changeStatus(API_STATUS.SUSPENDED, reason),
      activate: () => changeStatus(API_STATUS.ACTIVE, ACTIVATE_REASON),
    },
    message: {
      href: chatPath(CHAT_BASE_PATHS.ADMIN, { id: userId }),
      open: canMessage && messageUserId === userId,
      start: canMessage ? () => setMessageUserId(userId) : undefined,
      close: closeMessage,
      send: (message) => startConversation({ recipientId: userId, message }),
    },
  };
};
