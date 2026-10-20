import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, MoreVertical } from 'lucide-react';
import SegmentedTabs from '@/components/common/SegmentedTabs/SegmentedTabs';
import Skeleton from '@/components/loader/common/Skeleton';
import StatusBadge from './StatusBadge';

/**
 * Prop-driven data table toolkit.
 * Toggle: showTabs / showSearch / showFilters / showTable / showActions / showPagination
 */
const DataTable = ({
  showTabs = false,
  tabs = [],
  activeTab,
  onTabChange,

  showSearch = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',

  showFilters = false,
  filterLabel = 'Sort by:',
  filters = [],

  showTable = true,
  columns = [],
  data = [],
  emptyMessage = 'No data found',
  getRowKey = (row, index) => row?.id ?? index,
  loading = false,
  skeletonRows = 7,

  showActions = false,
  actions = [],
  getActions,
  actionType = 'menu',
  actionHeader = 'Action',

  showPagination = false,
  pagination = null,

  showCard = true,
  bgClassName = 'bg-white',
  className = '',
  tableMinWidth = '900px',
}) => {
  const showActionColumn =
    showActions && (typeof getActions === 'function' || actions.length > 0);
  const showToolbar = showTabs || showSearch || showFilters;
  const colSpan = columns.length + (showActionColumn ? 1 : 0);

  const wrapperClassName = [
    'w-full overflow-visible',
    showCard ? ['rounded-xl border border-[#E4E7EC] p-4 sm:p-5', bgClassName || ''].filter(Boolean).join(' ') : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClassName} aria-busy={loading || undefined}>
      {showToolbar ? (
        <div className="mb-3 flex flex-col gap-3">
          {showSearch ? (
            <>
              {showTabs && tabs.length > 0 ? (
                <SegmentedTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
              ) : null}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex w-full min-w-0 max-w-md items-center rounded-lg border border-[#E4E7EC] bg-white px-3 py-2 focus-within:border-primary">
                  <input
                    type="search"
                    value={searchValue}
                    onChange={(event) => onSearchChange?.(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full min-w-0 bg-transparent text-sm text-deep-blue placeholder:text-[#98A2B3] outline-none"
                  />
                </label>
                {showFilters && filters.length > 0 ? (
                  <div className="order-last self-end sm:order-none sm:self-auto">
                    <FiltersBar filterLabel={filterLabel} filters={filters} />
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {showTabs && tabs.length > 0 ? (
                <SegmentedTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
              ) : (
                <div />
              )}
              {showFilters && filters.length > 0 ? (
                <FiltersBar filterLabel={filterLabel} filters={filters} />
              ) : null}
            </div>
          )}
        </div>
      ) : null}

      {showTable ? (
        <div className="w-full overflow-x-auto overflow-y-visible">
          <table
            className="w-full border-collapse text-left text-sm"
            style={{ minWidth: tableMinWidth }}
          >
            <thead>
              <tr className="border-b border-[#E4E7EC] bg-secondary/60">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-3 py-3 font-semibold whitespace-nowrap text-deep-blue sm:px-4 ${column.headerClassName || ''}`}
                  >
                    {column.header}
                  </th>
                ))}
                {showActionColumn ? (
                  <th className="px-3 py-3 font-semibold whitespace-nowrap text-deep-blue sm:px-4">
                    {actionHeader}
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                    <tr key={`skeleton-${rowIndex}`} className="border-b border-[#F4F5F7] last:border-b-0">
                      {columns.map((column) => (
                        <td key={column.key} className={`px-3 py-3.5 sm:px-4 ${column.className || ''}`}>
                          <Skeleton className="h-4 w-full max-w-[9rem]" />
                        </td>
                      ))}
                      {showActionColumn ? (
                        <td className="px-3 py-3.5 sm:px-4">
                          <Skeleton className="mx-auto h-5 w-5 rounded-full" />
                        </td>
                      ) : null}
                    </tr>
                  ))
                : null}

              {!loading && data.length === 0 ? (
                <tr>
                  <td colSpan={colSpan} className="px-4 py-10 text-center text-[#64748B]">
                    {emptyMessage}
                  </td>
                </tr>
              ) : null}

              {!loading
                ? data.map((row, rowIndex) => (
                    <tr key={getRowKey(row, rowIndex)} className="border-b border-[#F4F5F7] last:border-b-0">
                      {columns.map((column) => {
                        const value = row?.[column.key];
                        const wrapClass = column.wrap ? 'whitespace-normal break-words' : 'whitespace-nowrap';
                        return (
                          <td
                            key={column.key}
                            className={`px-3 py-3.5 text-deep-blue sm:px-4 ${wrapClass} ${column.className || ''}`}
                          >
                            {typeof column.render === 'function'
                              ? column.render(value, row, rowIndex)
                              : value ?? '—'}
                          </td>
                        );
                      })}
                      {showActionColumn ? (
                        <td className="px-3 py-3.5 sm:px-4">
                          <RowActions
                            row={row}
                            actions={
                              typeof getActions === 'function' ? getActions(row) : actions
                            }
                            actionType={actionType}
                          />
                        </td>
                      ) : null}
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      ) : null}

      {showPagination && pagination && !loading ? <PaginationBar pagination={pagination} /> : null}
      {showPagination && loading ? (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-5 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      ) : null}
    </div>
  );
};

function FiltersBar({ filterLabel, filters }) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
      {filterLabel ? (
        <span className="text-sm font-medium text-deep-blue">{filterLabel}</span>
      ) : null}
      {filters.map((filter) => (
        <FilterSelect key={filter.id} filter={filter} />
      ))}
    </div>
  );
}

function FilterSelect({ filter }) {
  return (
    <label className="relative inline-flex min-w-[140px] items-center">
      <select
        value={filter.value ?? ''}
        onChange={(event) => filter.onChange?.(event.target.value)}
        disabled={filter.disabled}
        className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-[#E4E7EC] bg-white py-2 pl-3 pr-9 text-sm text-deep-blue outline-none transition-colors hover:border-[#D0D5DD] focus:border-primary disabled:cursor-not-allowed"
        aria-label={filter.placeholder || filter.id}
      >
        {filter.placeholder && !filter.options?.some((o) => o.value === '') ? (
          <option value="" disabled>
            {filter.placeholder}
          </option>
        ) : null}
        {(filter.options || []).map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 h-4 w-4 text-[#64748B]"
        aria-hidden
      />
    </label>
  );
}

function RowActions({ row, actions, actionType }) {
  if (actionType === 'buttons') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {actions.map((action) => (
          <button
            key={action.id || action.label}
            type="button"
            disabled={action.disabled?.(row)}
            onClick={() => action.onClick?.(row)}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
              action.variant === 'danger'
                ? 'bg-pink-secondary text-pink-light hover:opacity-90'
                : 'bg-[#F3F4F6] text-deep-blue hover:bg-[#E4E7EC]'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {action.label}
          </button>
        ))}
      </div>
    );
  }

  return <ActionMenu row={row} actions={actions} />;
}

function ActionMenu({ row, actions }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const menuId = useId();

  const updatePosition = () => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const menuWidth = menuRef.current?.offsetWidth || 148;
    const menuHeight = menuRef.current?.offsetHeight || actions.length * 42 + 8;
    const gap = 6;

    let top = rect.bottom + gap;
    let left = rect.right - menuWidth;

    if (top + menuHeight > window.innerHeight - 8) {
      top = rect.top - menuHeight - gap;
    }
    if (left < 8) left = 8;
    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8;
    }

    setCoords({ top, left });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, actions.length]);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      const inButton = buttonRef.current?.contains(event.target);
      const inMenu = menuRef.current?.contains(event.target);
      if (!inButton && !inMenu) setOpen(false);
    };

    const onReposition = () => updatePosition();

    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('resize', onReposition);
    window.addEventListener('scroll', onReposition, true);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('scroll', onReposition, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="rounded-md p-1.5 text-[#64748B] transition-colors hover:bg-[#F9FAFB]"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {open
        ? createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              style={{ top: coords.top, left: coords.left }}
              className="fixed z-[9999] min-w-[160px] overflow-hidden rounded-lg border border-[#E4E7EC] bg-white"
            >
              {actions.map((action) => (
                <button
                  key={action.id || action.label}
                  type="button"
                  role="menuitem"
                  disabled={action.disabled?.(row)}
                  onClick={() => {
                    action.onClick?.(row);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    action.variant === 'danger'
                      ? 'text-pink-light hover:bg-pink-secondary'
                      : 'text-deep-blue hover:bg-[#F9FAFB]'
                  }`}
                >
                  {action.icon ? (
                    <action.icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                  ) : null}
                  {action.label}
                </button>
              ))}
            </div>,
            document.body
          )
        : null}
    </>
  );
}

function PaginationBar({ pagination }) {
  const page = Number(pagination.page) || 1;
  const pageSize = Number(pagination.pageSize) || 10;
  const total = Number(pagination.total) || 0;

  const from = pagination.from ?? (total === 0 ? 0 : (page - 1) * pageSize + 1);
  const to = pagination.to ?? (total === 0 ? 0 : Math.min(page * pageSize, total));

  const hasPrevious = pagination.hasPrevious ?? page > 1;
  const hasNext = pagination.hasNext ?? page * pageSize < total;

  const goPrevious = () => {
    if (!hasPrevious) return;
    if (pagination.onPrevious) {
      pagination.onPrevious();
      return;
    }
    pagination.onPageChange?.(page - 1);
  };

  const goNext = () => {
    if (!hasNext) return;
    if (pagination.onNext) {
      pagination.onNext();
      return;
    }
    pagination.onPageChange?.(page + 1);
  };

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
      <p className="min-w-0 text-sm font-medium text-primary">
        {pagination.summaryLabel || `Showing ${from} to ${to} of ${total} results`}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={goPrevious}
          disabled={!hasPrevious}
          className="rounded-md border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:border-[#E4E7EC] disabled:text-[#98A2B3] disabled:hover:bg-white"
        >
          {pagination.previousLabel || 'Previous'}
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!hasNext}
          className="rounded-md border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:border-[#E4E7EC] disabled:text-[#98A2B3] disabled:hover:bg-white"
        >
          {pagination.nextLabel || 'Next'}
        </button>
      </div>
    </div>
  );
}

export default DataTable;
export { StatusBadge };
