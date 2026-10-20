import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchUserProfile,
  clearProfileError,
  toProfilePageUser,
} from "@/features/dash/user/profile";
import { fetchMyReports, clearReportsError, toMyReportModel } from "@/features/dash/user/reports";
import { MY_REPORTS_QUERY } from "../constant/constants";
import { isPremiumMember, showsSubscriptionCard } from "../utils/membership";

/** Signed-in user's profile and submitted reports, with membership flags. */
export function useProfilePage() {
  const dispatch = useDispatch();
  const { user, loading, error: profileError } = useSelector((state) => state.userProfile);
  const { reports, reportsLoading, error: reportsError } = useSelector(
    (state) => state.userReports,
  );

  useEffect(() => {
    dispatch(clearProfileError());
    dispatch(clearReportsError());
    dispatch(fetchUserProfile());
    dispatch(fetchMyReports(MY_REPORTS_QUERY));
  }, [dispatch]);

  useEffect(() => {
    if (profileError) toast.error(profileError);
  }, [profileError]);

  useEffect(() => {
    if (reportsError) toast.error(reportsError);
  }, [reportsError]);

  const profileUser = useMemo(() => toProfilePageUser(user), [user]);
  const myReports = useMemo(
    () => (reports || []).map(toMyReportModel).filter(Boolean),
    [reports],
  );

  return {
    profileUser,
    loading,
    isPremium: isPremiumMember(profileUser),
    showSubscription: showsSubscriptionCard(profileUser),
    reports: myReports,
    reportsLoading,
  };
}
