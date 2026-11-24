import Card from "@/components/ui/Card";
import ActivityTabBar from "../activity/ActivityTabBar";
import ActivityItems from "../activity/ActivityItems";
import { useActivityTab } from "../../hooks/useActivityTab";
import { buildActivityTabs } from "../../utils/activity";
import { POSTS_TAB, USER_CONTENT_KINDS } from "../../constant/constants";

/**
 * Posts tab plus one tab per content kind (`advertisements` | `listings` | `jobs`)
 * for a user's admin profile. `posts` is the feed node; the tab lives in `?tab=`.
 */
const ProfileActivityTabs = ({
  posts,
  postsTotal,
  content,
  contentLoading = false,
  kinds = USER_CONTENT_KINDS,
}) => {
  const tabs = buildActivityTabs({ postsTotal, kinds, content, contentLoading });
  const { active, setActive } = useActivityTab(tabs);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <ActivityTabBar
          tabs={tabs}
          activeId={active.id}
          onChange={setActive}
          className="overflow-x-auto border-b-0 [scrollbar-width:none]"
        />
      </Card>

      {active.id === POSTS_TAB.id ? (
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
