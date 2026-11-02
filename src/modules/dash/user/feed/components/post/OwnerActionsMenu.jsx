import { useEffect, useRef, useState } from 'react';
import { Flag, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

/** "…" menu with Edit / Delete for content the viewer owns, or Report for anyone else's. */
const OwnerActionsMenu = ({
  onEdit,
  onDelete,
  onReport,
  label = 'Options',
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  reportLabel = 'Report',
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
        className={`flex items-center justify-center rounded-full text-[#667085] transition-colors hover:text-deep-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
          small ? 'h-7 w-7 hover:bg-[#E4E7EC]' : 'h-9 w-9 hover:bg-[#F2F4F7]'
        } ${open ? (small ? 'bg-[#E4E7EC]' : 'bg-[#F2F4F7] text-deep-blue') : ''}`}
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
          {onReport ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onReport();
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-semibold text-[#475467] transition-colors hover:bg-[#F9FAFB]"
            >
              <Flag className="h-4 w-4" strokeWidth={1.8} />
              {reportLabel}
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
