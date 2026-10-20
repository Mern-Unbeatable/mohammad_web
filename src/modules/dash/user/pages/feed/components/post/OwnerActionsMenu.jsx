import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

/** "…" menu with Edit / Delete for content the viewer owns (posts, comments). */
const OwnerActionsMenu = ({
  onEdit,
  onDelete,
  label = 'Options',
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  size = 'md',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const small = size === 'sm';

  return (
    <div ref={rootRef} className={`relative shrink-0 ${className}`.trim()}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`rounded-full text-[#98A2B3] hover:text-[#64748B] ${
          small ? 'p-1 hover:bg-[#E4E7EC]' : 'p-1.5 hover:bg-[#F9FAFB]'
        }`}
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <MoreHorizontal className={small ? 'h-4 w-4' : 'h-5 w-5'} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+4px)] z-[20] w-[160px] overflow-hidden rounded-lg border border-[#E4E7EC] bg-white py-1 shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
        >
          {onEdit ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-semibold text-deep-blue transition-colors hover:bg-[#F9FAFB]"
            >
              <Pencil className="h-4 w-4" strokeWidth={1.8} />
              {editLabel}
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onDelete();
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-semibold text-[#DC2626] transition-colors hover:bg-[#FEF2F2]"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.8} />
              {deleteLabel}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default OwnerActionsMenu;
