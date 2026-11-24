import { useSelector } from "react-redux";
import { toProfilePageUser } from "@/features/dash/user/profile";
import ProfileCard from "./ProfileCard";
import TrialCard from "./TrialCard";
import QuickLinksCard from "./QuickLinksCard";
import SponsoredAdsCard from "./SponsoredAdsCard";

const LeftSidebar = () => {
  const { user } = useSelector((state) => state.userProfile);
  const profileUser = toProfilePageUser(user);

  return (
    <div className="hidden w-[320px] shrink-0 lg:block">
      <div className="sticky top-[70px] space-y-3">
        <ProfileCard user={profileUser} />
        <TrialCard user={profileUser} />
        <SponsoredAdsCard />
        <QuickLinksCard />
      </div>
    </div>
  );
};

export default LeftSidebar;
