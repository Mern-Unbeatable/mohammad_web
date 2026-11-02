import { PostComments } from "@/modules/dash/user/feed";

const AdComments = ({ comments, onAddComment, onLikeComment }) => (
  <div className="overflow-hidden rounded-xl border border-[#E4E7EC] bg-white">
    <PostComments
      comments={comments}
      onAddComment={onAddComment}
      onLikeComment={onLikeComment}
    />
  </div>
);

export default AdComments;
