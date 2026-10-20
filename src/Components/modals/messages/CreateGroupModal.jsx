import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import RecipientPicker from '../recipients/RecipientPicker';

const fieldClass =
  'w-full rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10';

const CreateGroupForm = ({
  onClose,
  onCreate,
  recipients,
  recipientsLoading,
  onSearchRecipients,
  submitting,
}) => {
  const [groupName, setGroupName] = useState('');
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const canSubmit = groupName.trim().length > 0 && selected.length > 0 && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const ok = await onCreate?.({ name: groupName.trim(), members: selected });
    if (ok !== false) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-white sm:max-w-[480px] sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-group-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-[#E4E7EC] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[#64748B] hover:bg-[#F9FAFB]"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 id="create-group-title" className="text-[17px] font-bold text-deep-blue sm:text-[18px]">
            Create Group Chat
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
        >
          <label htmlFor="groupName" className="mb-1.5 block text-[13px] font-semibold text-deep-blue">
            Group Name
          </label>
          <input
            id="groupName"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            maxLength={160}
            placeholder="e.g. Microbiology Network EU"
            className={fieldClass}
            required
          />

          <p className="mb-2 mt-5 text-[13px] font-semibold text-deep-blue">
            Add Members{selected.length ? ` (${selected.length})` : ''}
          </p>
          <RecipientPicker
            multiple
            recipients={recipients}
            loading={recipientsLoading}
            selected={selected}
            onChange={setSelected}
            onSearch={onSearchRecipients}
          />

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E4E7EC] px-4 py-2.5 text-[13px] font-semibold text-[#475467] hover:bg-[#F9FAFB]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0] disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/** Form state resets on every open because the form remounts. */
const CreateGroupModal = ({ open, ...props }) =>
  open ? <CreateGroupForm {...props} /> : null;

export default CreateGroupModal;
