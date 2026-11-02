import { useLocation, useNavigate } from "react-router";
import { activeChatTab, chatTabPath } from "../utils/moderation";

/** Active chat tab from the URL; switching tabs navigates. */
export const useChatTabs = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activeTab = activeChatTab(pathname);

  const changeTab = (tab) => {
    if (tab !== activeTab) navigate(chatTabPath(tab));
  };

  return { activeTab, changeTab };
};
