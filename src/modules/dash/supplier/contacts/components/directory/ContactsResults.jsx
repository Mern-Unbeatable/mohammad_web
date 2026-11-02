import { CardSkeleton } from "@/components/loader";
import ContactCard from "@/components/data-display/ContactCard/ContactCard";
import { CONTACTS_GRID_CLASS, CONTACTS_PAGE_SIZE, CONTACTS_PATH } from "../../constant/constants";
import ResultsMessage from "./ResultsMessage";

/** Contact cards with skeleton and empty states. */
const ContactsResults = ({
  loading,
  cards,
  emptyText,
  isRequests,
  connectingId,
  acceptingId,
  onConnect,
  onAccept,
}) => {
  if (loading) {
    return (
      <CardSkeleton variant="contact" count={CONTACTS_PAGE_SIZE} className={CONTACTS_GRID_CLASS} />
    );
  }

  if (!cards.length) {
    return (
      <ResultsMessage>
        <p className="text-[14px] text-[#64748B]">{emptyText}</p>
      </ResultsMessage>
    );
  }

  return (
    <div className={CONTACTS_GRID_CLASS}>
      {cards.map((contact) => (
        <ContactCard
          key={contact.connectionId || contact.id}
          contact={contact}
          profileBasePath={CONTACTS_PATH}
          connected={contact.connected}
          pending={contact.pending || connectingId === contact.id}
          incoming={contact.incoming || isRequests}
          accepting={acceptingId === contact.connectionId}
          onConnect={onConnect}
          onAccept={onAccept}
        />
      ))}
    </div>
  );
};

export default ContactsResults;
