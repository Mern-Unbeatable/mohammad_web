import ContentRow from "./ContentRow";
import { ROW_DETAILS } from "../../utils/activity";

const GRID_CLASS =
  "grid grid-cols-1 gap-3 p-4 sm:px-6 md:grid-cols-2 2xl:grid-cols-3";

/** Rows for one content kind (`advertisements` | `listings` | `jobs`). */
const ActivityItems = ({ kind, section, loading, empty, gridClassName = GRID_CLASS }) => {
  if (loading) {
    return (
      <ul className={gridClassName}>
        {[0, 1, 2].map((key) => (
          <li
            key={key}
            className="flex items-center gap-3 rounded-xl border border-[#E4E7EC] p-3"
          >
            <span className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-[#E4E7EC]" />
            <span className="flex-1 space-y-2">
              <span className="block h-3.5 w-2/3 animate-pulse rounded bg-[#E4E7EC]" />
              <span className="block h-3 w-1/3 animate-pulse rounded bg-[#E4E7EC]" />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  if (!section?.items?.length) {
    return (
      <p className="px-5 py-10 text-center text-[14px] text-[#64748B] sm:px-6">
        {empty}
      </p>
    );
  }

  return (
    <>
      <ul className={gridClassName}>
        {section.items.map((item) => (
          <ContentRow key={item.id} item={item} details={ROW_DETAILS[kind](item)} />
        ))}
      </ul>
      {section.total > section.items.length ? (
        <p className="border-t border-[#E4E7EC] px-5 py-3 text-[12px] text-[#64748B] sm:px-6">
          Showing the latest {section.items.length} of {section.total}.
        </p>
      ) : null}
    </>
  );
};

export default ActivityItems;
