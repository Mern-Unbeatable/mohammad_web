import { Link } from "react-router";
import { List, Newspaper, Plus } from "lucide-react";
import PanelPageHeader from "@/shared/layout/PanelLayout/PanelPageHeader";
import { panelPrimaryBtn } from "@/shared/layout/PanelLayout/panelPageTheme";
import { generalCategories } from "@/modules/user/data/general";
import { GENERAL_PATH, GENERAL_VIEW, MY_GENERAL_POSTS_PATH } from "../../constant/constants";

const actionBtn =
  "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[12px] font-semibold transition-colors";

const GeneralToolbar = ({
  category,
  onCategoryChange,
  activeView = GENERAL_VIEW.BROWSE,
  onCreatePost,
  showBrowse = true,
  showMyPost = true,
  showCreatePost = true,
  browseHref = GENERAL_PATH,
  myPostHref = MY_GENERAL_POSTS_PATH,
}) => (
  <div className="mb-4 space-y-3 md:mb-6 lg:mb-8">
    <PanelPageHeader
      title="General"
      subtitle="Events, training, industry news, and documentation for the laboratory community."
      action={
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          {showBrowse ? (
            <Link
              to={browseHref}
              className={`${actionBtn} w-full sm:w-auto ${
                activeView === GENERAL_VIEW.BROWSE
                  ? "bg-[#E8F3FB] text-primary"
                  : "border border-primary/30 text-primary hover:bg-[#E8F3FB]"
              }`}
            >
              <Newspaper className="h-3.5 w-3.5" />
              All Posts
            </Link>
          ) : null}
          {showMyPost ? (
            <Link
              to={myPostHref}
              className={`${actionBtn} w-full sm:w-auto ${
                activeView === GENERAL_VIEW.MINE
                  ? "bg-green-secondary text-green-primary"
                  : "border border-green-primary/30 text-green-primary hover:bg-green-secondary"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              My Post
            </Link>
          ) : null}
          {showCreatePost ? (
            <button
              type="button"
              onClick={onCreatePost}
              className={`${panelPrimaryBtn} w-full sm:w-auto`}
            >
              <Plus className="h-3.5 w-3.5" />
              Create Post
            </button>
          ) : null}
        </div>
      }
    />

    <div className="flex flex-wrap gap-2">
      {generalCategories.map((item) => {
        const isActive = category === item;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onCategoryChange(item)}
            className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
              isActive
                ? "bg-[#E67E22] text-white"
                : "border border-[#E4E7EC] bg-white text-[#475467] hover:border-[#D0D5DD] hover:text-deep-blue"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  </div>
);

export default GeneralToolbar;
