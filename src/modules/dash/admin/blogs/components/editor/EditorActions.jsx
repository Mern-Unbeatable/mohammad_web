import { Link } from "react-router";
import {
  panelPrimaryBtn,
  panelSecondaryBtn,
} from "@/components/navigation/panel/panelPageTheme";
import { BLOGS_PATH } from "../../constant/constants";

/** Submit (label from `submitLabel`) and Cancel back to the list. */
const EditorActions = ({ label, busy }) => (
  <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap">
    <button
      type="submit"
      disabled={busy}
      className={`${panelPrimaryBtn} w-full sm:w-auto disabled:opacity-60`}
    >
      {label}
    </button>
    <Link
      to={BLOGS_PATH}
      className={`${panelSecondaryBtn} w-full sm:w-auto ${busy ? "pointer-events-none opacity-60" : ""}`}
    >
      Cancel
    </Link>
  </div>
);

export default EditorActions;
