import { GeneralToolbar } from "@/modules/dash/user/general";
import { GENERAL_PATH, MY_GENERAL_POSTS_PATH } from "../../constant/constants";

/** The shared General toolbar, pointed at the supplier routes. */
const SupplierGeneralToolbar = ({ category, onCategoryChange, activeView, onCreatePost }) => (
  <GeneralToolbar
    category={category}
    onCategoryChange={onCategoryChange}
    activeView={activeView}
    onCreatePost={onCreatePost}
    browseHref={GENERAL_PATH}
    myPostHref={MY_GENERAL_POSTS_PATH}
  />
);

export default SupplierGeneralToolbar;
