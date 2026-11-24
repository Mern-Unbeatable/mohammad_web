import { Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import {
  panelPageTheme,
  panelPrimaryBtn,
} from "@/components/layout/panelPageTheme";
import { Input } from "@/components/form-controls";
import { saveLabel } from "../../utils/settingsForm";

const CategoryTag = ({ label, onRemove }) => (
  <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-green-secondary bg-green-secondary/40 px-3 py-1.5 text-[12px] font-semibold text-green-primary sm:text-[13px] lg:text-[14px]">
    <span className="truncate">{label}</span>
    <button
      type="button"
      onClick={onRemove}
      className="shrink-0 rounded p-0.5 text-pink-light hover:bg-pink-secondary/50"
      aria-label={`Remove ${label}`}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  </span>
);

/** Editable category list: Save categories, add input, removable tags. */
const CategorySection = ({ title, list }) => (
  <Card className="p-4 sm:p-5">
    <div className="mb-3 flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className={panelPageTheme.cardTitle}>{title}</h2>
        <button
          type="button"
          disabled={list.saving}
          onClick={list.save}
          className={`${panelPrimaryBtn} disabled:opacity-60`}
        >
          {saveLabel(list.saving, "Save categories")}
        </button>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          variant="settings"
          type="text"
          value={list.draft}
          onChange={(event) => list.setDraft(event.target.value)}
          placeholder="New category"
        />
        <button
          type="button"
          onClick={list.add}
          className={`${panelPrimaryBtn} w-full sm:w-auto sm:shrink-0`}
        >
          Add Category
        </button>
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      {list.items.map((category) => (
        <CategoryTag key={category} label={category} onRemove={() => list.remove(category)} />
      ))}
    </div>
  </Card>
);

export default CategorySection;
