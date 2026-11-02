import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchContactDetails,
  requestContactConnection,
  clearContactsError,
  clearSelectedContact,
  toContactProfileModel,
} from "@/features/dash/supplier/contacts";

export const useContactProfile = () => {
  const { contactId } = useParams();
  const dispatch = useDispatch();
  const { selectedContact, selectedContactLoading, connectingId, error } = useSelector(
    (state) => state.supplierContacts,
  );
  const [reportPost, setReportPost] = useState(null);
  /** Id whose fetch was rejected; any other id is not (yet) known to be missing. */
  const [missingId, setMissingId] = useState(null);

  useEffect(() => {
    if (!contactId) return undefined;
    dispatch(clearContactsError());
    dispatch(fetchContactDetails(contactId)).then((result) => {
      if (fetchContactDetails.rejected.match(result)) setMissingId(contactId);
    });
    return () => {
      dispatch(clearSelectedContact());
    };
  }, [dispatch, contactId]);

  useEffect(() => {
    if (error && !selectedContactLoading) toast.error(error);
  }, [error, selectedContactLoading]);

  const contact = useMemo(() => toContactProfileModel(selectedContact), [selectedContact]);
  const connecting = Boolean(contact) && connectingId === contact.id;

  const connect = async () => {
    if (!contact || contact.connected || contact.pending || connecting) return;
    const result = await dispatch(requestContactConnection(contact.id));
    if (requestContactConnection.fulfilled.match(result)) {
      toast.success("Connection request sent");
    }
  };

  return {
    notFound: Boolean(contactId) && missingId === contactId,
    loading: selectedContactLoading || (!selectedContact && !error),
    contact,
    connecting,
    connect,
    reportPost,
    setReportPost,
    closeReport: () => setReportPost(null),
  };
};
