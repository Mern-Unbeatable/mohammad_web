import { useMemo } from "react";
import { useSelector } from "react-redux";
import { toProfilePageUser } from "@/features/dash/user/profile";
import CreatePostModal from "@/components/modals/feed/CreatePostModal";
import { usePublishPost } from "../../hooks/usePublishPost";

/** Create-post dialog opened from the shell on pages other than the feed. */
const QuickCreatePost = ({ onClose }) => {
  const user = useSelector((state) => state.userProfile.user);
  const saving = useSelector((state) => state.userFeed.saving);
  const profileUser = useMemo(() => toProfilePageUser(user), [user]);
  const publish = usePublishPost(onClose);

  return (
    <CreatePostModal
      open
      onClose={onClose}
      user={profileUser}
      submitting={saving}
      onPublish={publish}
    />
  );
};

export default QuickCreatePost;
