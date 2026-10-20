import Pagination from "@/components/common/Pagination/Pagination";
import PanelPage from "@/components/navigation/panel/PanelPage";
import PanelPageHeader from "@/components/navigation/panel/PanelPageHeader";
import DirectoryFilters from "../components/directory/DirectoryFilters";
import ContactsResults from "../components/directory/ContactsResults";
import { useContactsDirectory } from "../hooks/useContactsDirectory";

const SupplierContactsView = () => {
  const directory = useContactsDirectory();

  return (
    <PanelPage>
      <PanelPageHeader
        title="Contacts Directory"
        subtitle="Find laboratory professionals, suppliers and companies across the network."
      />

      <DirectoryFilters
        filter={directory.filter}
        onFilterChange={directory.changeFilter}
        pendingRequests={directory.pendingRequests}
        query={directory.query}
        onQueryChange={directory.setQuery}
        country={directory.country}
        onCountryChange={directory.changeCountry}
      />

      <p className="text-[13px] text-[#64748B]">{directory.status}</p>

      <ContactsResults
        loading={directory.loading}
        cards={directory.cards}
        emptyText={directory.emptyText}
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
        className="mt-2"
      />
    </PanelPage>
  );
};

export default SupplierContactsView;
