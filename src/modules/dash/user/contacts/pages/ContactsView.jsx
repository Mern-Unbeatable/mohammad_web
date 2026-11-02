import Pagination from '@/components/common/Pagination/Pagination';
import DashboardPage from '@/components/layout/DashboardPage';
import DirectoryHeader from '../components/directory/DirectoryHeader';
import DirectoryFilters from '../components/directory/DirectoryFilters';
import ContactsResults from '../components/directory/ContactsResults';
import { useContactsDirectory } from '../hooks/useContactsDirectory';
import { emptyMessage, statusLabel } from '../utils/contactsLabels';

const ContactsView = () => {
  const directory = useContactsDirectory();

  return (
    <DashboardPage>
      <DirectoryHeader />

      <DirectoryFilters
        filter={directory.filter}
        onFilterChange={directory.changeFilter}
        pendingRequests={directory.pendingRequests}
        query={directory.query}
        onQueryChange={directory.setQuery}
        country={directory.country}
        onCountryChange={directory.changeCountry}
      />

      <p className="mb-5 text-[13px] text-[#64748B]">
        {statusLabel({
          loading: directory.loading,
          error: directory.error,
          filter: directory.filter,
          total: directory.total,
        })}
      </p>

      <ContactsResults
        loading={directory.loading}
        error={directory.error}
        onRetry={directory.retry}
        cards={directory.cards}
        emptyText={emptyMessage(directory)}
        isRequests={directory.isRequests}
        connectingId={directory.connectingId}
        acceptingId={directory.acceptingId}
        onConnect={directory.connect}
        onAccept={directory.accept}
      />

      <Pagination
        page={directory.page}
        totalPages={directory.totalPages}
        onPageChange={directory.changePage}
        className="mt-8"
      />
    </DashboardPage>
  );
};

export default ContactsView;
