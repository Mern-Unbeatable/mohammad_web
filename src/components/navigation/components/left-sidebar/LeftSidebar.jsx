import { useSelector } from "react-redux";
import { toProfilePageUser } from "@/features/user/profile";
import ProfileCard from "./ProfileCard";
import TrialCard from "./TrialCard";
import QuickLinksCard from "./QuickLinksCard";

const LeftSidebar = () => {
  const { user } = useSelector((state) => state.userProfile);
  const profileUser = toProfilePageUser(user);

  return (
    <div className="hidden w-[320px] shrink-0 lg:block">
      <div className="sticky top-[70px] space-y-3">
        <ProfileCard user={profileUser} />
        <TrialCard user={profileUser} />
        <QuickLinksCard />
      </div>
    </div>
  );
};

export default LeftSidebar;
