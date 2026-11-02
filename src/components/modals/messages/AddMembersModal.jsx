import { useState } from "react";
import { Loader2, X } from "lucide-react";
import RecipientPicker from "@/modules/messages/components/recipients/RecipientPicker";

/** Stacked above the group info modal; closing it returns to the member list. */
const AddMembersDialog = ({
  groupName,
  memberIds,
  recipients,
  recipientsLoading,
  onSearchRecipients,
  onAdd,
  onClose,
  busy,
}) => {
  const [selected, setSelected] = useState([]);

  const submit = async () => {
    if (selected.length === 0) return;
    const ok = await onAdd?.(selected);
    if (ok !== false) onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-[210] flex items-end justify-center bg-black/90 sm:items-center sm:p-4"
      onClick={(e) => {
        e.stopPropagation();
        onClose?.();
      }}
      role="presentation"
    >
      <div
        className="flex max-h-[85dvh] w-full flex-col rounded-t-2xl bg-white sm:max-w-[440px] sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-members-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-[#E4E7EC] px-5 py-4">
          <div className="min-w-0">
            <h2
              id="add-members-title"
              className="text-[17px] font-bold text-deep-blue"
            >
              Add members
            </h2>
            {groupName ? (
              <p className="mt-0.5 truncate text-[13px] text-[#64748B]">
                to {groupName}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F9FAFB]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <RecipientPicker
            multiple
            recipients={recipients}
            loading={recipientsLoading}
            selected={selected}
            onChange={setSelected}
            onSearch={onSearchRecipients}
            excludeIds={memberIds}
          />
        </div>

        <div className="flex shrink-0 justify-end gap-2 border-t border-[#E4E7EC] px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#E4E7EC] px-4 py-2 text-[13px] font-semibold text-[#475467] hover:bg-[#F9FAFB]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={busy || selected.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {selected.length ? `Add ${selected.length}` : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AddMembersModal = ({ open, ...props }) =>
  open ? <AddMembersDialog {...props} /> : null;

export default AddMembersModal;
