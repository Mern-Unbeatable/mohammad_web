import { useSearchParams } from "react-router";
import { Briefcase, Megaphone, Newspaper, Store } from "lucide-react";
import Card from "@/components/ui/Card";
import {
  ActivityItems,
  ActivityTabBar,
} from "@/modules/admin/components/ActivityItems";

const CONTENT_TABS = {
  advertisements: {
    param: "ads",
    label: "Ads",
    icon: Megaphone,
    empty: "No advertisements yet.",
  },
  listings: {
    param: "marketplace",
    label: "Marketplace",
    icon: Store,
    empty: "No marketplace listings yet.",
  },
  jobs: {
    param: "jobs",
    label: "Jobs",
    icon: Briefcase,
    empty: "No job posts yet.",
  },
};

/**
 * Posts tab plus one tab per content kind (`advertisements` | `listings` | `jobs`)
 * for a user's admin profile. `posts` is the feed node; the tab lives in `?tab=`.
 */
const ProfileActivityTabs = ({
  posts,
  postsTotal,
  content,
  contentLoading = false,
  kinds = ["jobs"],
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabs = [
    {
      id: "posts",
      param: "posts",
      label: "Posts",
      icon: Newspaper,
      count: postsTotal,
    },
    ...kinds.map((kind) => ({
      id: kind,
      ...CONTENT_TABS[kind],
      count: contentLoading ? "…" : (content?.[kind]?.total ?? 0),
    })),
  ];
  const active =
    tabs.find((tab) => tab.param === searchParams.get("tab")) || tabs[0];

  const setActiveTab = (id) => {
    const next = tabs.find((tab) => tab.id === id);
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (next === tabs[0]) params.delete("tab");
        else params.set("tab", next.param);
        return params;
      },
      { replace: true },
    );
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <ActivityTabBar
          tabs={tabs}
          activeId={active.id}
          onChange={setActiveTab}
          className="overflow-x-auto border-b-0 [scrollbar-width:none]"
        />
      </Card>

      {active.id === "posts" ? (
        posts
      ) : (
        <Card className="overflow-hidden">
          <ActivityItems
            kind={active.id}
            section={content?.[active.id]}
            loading={contentLoading}
            empty={active.empty}
            gridClassName="grid grid-cols-1 gap-3 p-4 sm:px-5"
          />
        </Card>
      )}
    </div>
  );
};

export default ProfileActivityTabs;
