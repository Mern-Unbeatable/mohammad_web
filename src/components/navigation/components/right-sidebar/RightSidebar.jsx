import { useRightSidebar } from "../../hooks/useRightSidebar";
import PeopleYouMayKnow from "./PeopleYouMayKnow";
import MarketplaceList from "./MarketplaceList";
import JobsList from "./JobsList";
import SponsoredAdsCard from "./SponsoredAdsCard";

const RightSidebar = () => {
  const {
    people,
    listings,
    jobs,
    peopleLoading,
    listingsLoading,
    jobsLoading,
    connectingId,
    handleConnect,
  } = useRightSidebar();

  return (
    <div className="hidden w-[320px] shrink-0 xl:block">
      <div className="sticky top-[70px] space-y-3">
        <PeopleYouMayKnow
          people={people}
          connectingId={connectingId}
          onConnect={handleConnect}
          loading={peopleLoading}
        />
        <SponsoredAdsCard />
        <MarketplaceList items={listings} loading={listingsLoading} />
        <JobsList items={jobs} loading={jobsLoading} />
      </div>
    </div>
  );
};

export default RightSidebar;
