import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { clearSettingsError, fetchAdminSettings } from "@/features/dash/admin/settings";

/**
 * Loads the settings and reports `status`: "error" (first load failed), "loading",
 * or "ready" with `formKey` (the request id) so the form remounts after each load.
 */
export const useAdminSettings = () => {
  const dispatch = useDispatch();
  const { settings, loading, loadedRequestId, error, saveError } = useSelector(
    (state) => state.adminSettings,
  );

  const reload = useCallback(() => {
    dispatch(clearSettingsError());
    dispatch(fetchAdminSettings());
  }, [dispatch]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (saveError) toast.error(saveError);
  }, [saveError]);

  let status = "ready";
  if (!loadedRequestId && error && !loading) status = "error";
  else if (loading || !loadedRequestId) status = "loading";

  return { status, error, reload, settings, formKey: loadedRequestId };
};
