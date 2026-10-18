import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import { Ban, CheckCircle2, ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import SuspendUserModal from "@/modules/admin/components/SuspendUserModal";
import Card from "@/components/ui/Card";
import ProfilePageContent from "@/components/data-display/ProfilePageContent/ProfilePageContent";
import { ProfilePageSkeleton } from "@/components/common/Skeleton";
import { SubscriptionDetailsCard } from "@/modules/user/components/profile/ProfileSections";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import { CHAT_BASE_PATHS, chatPath } from "@/shared/constants/chat";
import { roleLabel } from "@/shared/constants/roles";
import {
  fetchUserDetails,
  clearSelectedUser,
  updateUserStatus,
  usersApi,
} from "@/features/admin/users";
import SupplierActivityCard from "@/modules/admin/components/SupplierActivityCard";
import { toProfilePageUser } from "@/features/user/profile";
import { fetchAuthorPosts, toFeedPostModel } from "@/features/user/feed";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const STATUS_CLASS = {
  ACTIVE: "bg-green-secondary text-green-primary",
  SUSPENDED: "bg-[#F4F3FF] text-[#5925DC]",
  BANNED: "bg-[#FEF3F2] text-[#D92D20]",
};

const AccountDetailsCard = ({ user, updating, onSuspend, onActivate }) => {
  const status = String(user.status || "ACTIVE").toUpperCase();
  const isActive = status === "ACTIVE";
  const rows = [
    ["Role", roleLabel(user.role)],
    ["Account type", user.profileType || "—"],
    ["Joined", formatDate(user.createdAt)],
    ["Last login", formatDate(user.lastLoginAt)],
    ["Warnings", String(user.warnings ?? 0)],
  ];

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-primary bg-primary px-5 py-4 sm:px-6">
        <h2 className="text-[16px] font-bold text-white">Account details</h2>
        <p className="mt-1 text-[13px] text-white/80">
          Visible to admins only.
        </p>
      </div>
      <dl className="divide-y divide-[#E4E7EC] px-5 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-3.5">
          <dt className="text-[13px] text-[#64748B]">Status</dt>
          <dd>
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                STATUS_CLASS[status] || STATUS_CLASS.ACTIVE
              }`}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </span>
          </dd>
        </div>
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 py-3.5"
          >
            <dt className="text-[13px] text-[#64748B]">{label}</dt>
            <dd className="text-right text-[13px] font-semibold text-deep-blue">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-[#E4E7EC] px-5 py-4 sm:px-6">
        {isActive ? (
          <button
            type="button"
            onClick={onSuspend}
            disabled={updating}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#D92D20] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#B42318] disabled:cursor-wait disabled:opacity-60"
          >
            {updating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Ban className="h-4 w-4" />
            )}
            Suspend user
          </button>
        ) : (
          <button
            type="button"
            onClick={onActivate}
            disabled={updating}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#079455] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#067647] disabled:cursor-wait disabled:opacity-60"
          >
            {updating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Activate user
          </button>
        )}
      </div>
    </Card>
  );
};

const BackLink = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    if (location.key === "default") navigate("/admin/users");
    else navigate(-1);
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className="inline-flex items-center gap-1.5 rounded-full px-1 py-1 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
    >
      <ChevronLeft className="h-4 w-4" />
      Back
    </button>
  );
};

const AdminUserDetailView = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { selectedUser, selectedUserLoading, error } = useSelector(
    (state) => state.adminUsers,
  );
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

  const isSupplier =
    selectedUser?.id === userId &&
    (selectedUser.role === "SUPPLIER" ||
      selectedUser.profileType === "SUPPLIER");

  useEffect(() => {
    if (!isSupplier) return undefined;
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
  }, [isSupplier, userId]);

  useEffect(() => {
    if (userId) dispatch(fetchUserDetails(userId));
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [dispatch, userId]);

  useEffect(() => {
    if (userId) dispatch(fetchAuthorPosts({ authorId: userId }));
  }, [dispatch, userId]);

  const profileUser = useMemo(
    () => toProfilePageUser(selectedUser),
    [selectedUser],
  );

  const changeStatus = async (status, reason) => {
    if (updatingStatus) return;
    setUpdatingStatus(true);
    const result = await dispatch(updateUserStatus({ userId, status, reason }));
    setUpdatingStatus(false);
    if (updateUserStatus.fulfilled.match(result)) {
      toast.success(
        status === "SUSPENDED"
          ? "User suspended successfully"
          : "User activated successfully",
      );
    } else {
      toast.error(result.payload || "Failed to update user status");
    }
  };

  const isThisAuthor = authorPostsAuthorId === userId;
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

  if (selectedUserLoading || (!selectedUser && !error)) {
    return (
      <PanelPage>
        <BackLink />
        <ProfilePageSkeleton showSubscription sidebar />
      </PanelPage>
    );
  }

  if (error || !profileUser) {
    return (
      <PanelPage>
        <BackLink />
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-[16px] font-semibold text-deep-blue">
            {error || "User details not found"}
          </p>
        </div>
      </PanelPage>
    );
  }

  const isPremium = ["premium", "trial", "cancelled"].includes(
    profileUser.membershipStatus,
  );

  return (
    <PanelPage>
      <BackLink />
      <ProfilePageContent
        user={profileUser}
        posts={posts}
        postsLoading={!isThisAuthor || authorPostsLoading}
        hasMorePosts={hasMorePosts}
        loadingMorePosts={authorPostsLoadingMore}
        onLoadMorePosts={() =>
          dispatch(
            fetchAuthorPosts({
              authorId: userId,
              page: (authorPostsMeta?.page ?? 1) + 1,
            }),
          )
        }
        isPremium={isPremium}
        showEdit={false}
        showMessage
        messageHref={chatPath(CHAT_BASE_PATHS.ADMIN, { id: userId })}
        subscriptionSlot={
          <SubscriptionDetailsCard
            subscription={profileUser.subscription}
            manageable={false}
            accent
          />
        }
        sidebarSlot={
          <AccountDetailsCard
            user={selectedUser}
            updating={updatingStatus}
            onSuspend={() => setSuspendOpen(true)}
            onActivate={() =>
              changeStatus("ACTIVE", "Account activated by admin")
            }
          />
        }
        mainSlot={
          isSupplier ? (
            <SupplierActivityCard
              content={contentCache.key === userId ? contentCache.data : null}
              loading={contentCache.key !== userId}
            />
          ) : null
        }
        postsTitle={null}
        threeColumn
      />

      <SuspendUserModal
        open={suspendOpen}
        userName={profileUser.name}
        onClose={() => setSuspendOpen(false)}
        onConfirm={(reason) => changeStatus("SUSPENDED", reason)}
      />
    </PanelPage>
  );
};

export default AdminUserDetailView;
