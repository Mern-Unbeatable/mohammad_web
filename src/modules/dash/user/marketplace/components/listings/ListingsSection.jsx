import { CardSkeleton } from '@/components/loader';
import { LISTINGS_GRID_CLASS, LISTINGS_PAGE_SIZE } from '../../constant/constants';
import ListingsMessage from './ListingsMessage';

/**
 * Titled listings grid with loading, error and empty states.
 * `renderCard` renders one card model; `onRetry` is shown with `error`.
 */
const ListingsSection = ({
  title,
  loading,
  error,
  onRetry,
  cards,
  renderCard,
  emptyTitle,
  emptyText,
  children,
}) => (
  <section className="mt-6">
    <h2 className="mb-4 text-[16px] font-bold text-deep-blue">{title}</h2>

    {loading ? (
      <CardSkeleton variant="listing" count={LISTINGS_PAGE_SIZE} className={LISTINGS_GRID_CLASS} />
    ) : error ? (
      <ListingsMessage title="Couldn't load listings">
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 text-[14px] font-semibold text-primary hover:underline"
        >
          Try again
        </button>
      </ListingsMessage>
    ) : cards.length > 0 ? (
      <div className={LISTINGS_GRID_CLASS}>{cards.map(renderCard)}</div>
    ) : (
      <ListingsMessage title={emptyTitle}>
        <p className="mt-2 text-[14px] text-[#64748B]">{emptyText}</p>
      </ListingsMessage>
    )}

    {children}
  </section>
);

export default ListingsSection;
