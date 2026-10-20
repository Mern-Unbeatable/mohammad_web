import { Outlet } from "react-router";
import PanelPage from "@/components/layout/PanelPage";
import PanelPageHeader from "@/components/layout/PanelPageHeader";
import SegmentedTabs from "@/components/common/SegmentedTabs/SegmentedTabs";
import { useChatTabs } from "../hooks/useChatTabs";
import { CHAT_TABS } from "../constant/constants";

/** Admin chat shell: the active tab is the route (inbox sections vs `/moderation`). */
const AdminChatView = () => {
  const { activeTab, changeTab } = useChatTabs();

  return (
    <PanelPage layout="fill">
      <PanelPageHeader
        title="Chat"
        subtitle="Message members and moderate platform conversations."
        action={
          <SegmentedTabs
            tabs={CHAT_TABS}
            activeTab={activeTab}
            onTabChange={changeTab}
            ariaLabel="Chat sections"
          />
        }
      />
      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <Outlet />
      </div>
    </PanelPage>
  );
};

export default AdminChatView;
