import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-hot-toast";
import { fetchUsersList, updateUserStatus } from "@/features/dash/admin/users";
import {
  applyParamChanges,
  applySearch,
  buildUsersQuery,
  getUserRowActions,
  readListParams,
  toStatusUpdate,
  toUserRow,
} from "../utils/usersList";
import {
  ALL,
  API_STATUS,
  MESSAGES,
  ROW_STATUS,
  SEARCH_DEBOUNCE_MS,
  USERS_PAGE_SIZE,
  USER_TAB,
  userDetailPath,
} from "../constant/constants";

/**
 * Users list driven by the URL (`tab`, `page`, `plan`, `status`, `q`): debounced
 * search, filters, paging, row actions and the suspend dialog.
 */
export const useAdminUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, usersMeta, usersLoading, error } = useSelector((state) => state.adminUsers);

  const [searchParams, setSearchParams] = useSearchParams();
  const { tab, page, planFilter, statusFilter, search: urlSearch } = readListParams(searchParams);

  const [search, setSearch] = useState(urlSearch);
  const [syncedSearch, setSyncedSearch] = useState(urlSearch);
  const [suspendTarget, setSuspendTarget] = useState(null);

  if (syncedSearch !== urlSearch) {
    setSyncedSearch(urlSearch);
    setSearch(urlSearch);
  }

  const updateParams = (changes) => setSearchParams((prev) => applyParamChanges(prev, changes));

  useEffect(() => {
    const q = search.trim();
    if (q === urlSearch) return undefined;
    const timer = setTimeout(() => {
      setSearchParams((prev) => applySearch(prev, q), { replace: true });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search, urlSearch, setSearchParams]);

  const query = buildUsersQuery({ page, tab, statusFilter, planFilter, search: urlSearch });

  useEffect(() => {
    dispatch(
      fetchUsersList(buildUsersQuery({ page, tab, statusFilter, planFilter, search: urlSearch })),
    );
  }, [dispatch, page, tab, statusFilter, planFilter, urlSearch]);

  const rows = useMemo(() => (users?.length ? users.map(toUserRow) : []), [users]);

  const changeStatus = async (userId, rowLabel, reason = "") => {
    const update = toStatusUpdate(rowLabel, reason);
    const result = await dispatch(updateUserStatus({ userId, ...update }));
    if (updateUserStatus.fulfilled.match(result)) {
      toast.success(update.status === API_STATUS.SUSPENDED ? MESSAGES.SUSPENDED : MESSAGES.ACTIVATED);
      dispatch(fetchUsersList(query));
    } else {
      toast.error(result.payload || MESSAGES.UPDATE_FAILED);
    }
  };

  const rowActions = (row) =>
    getUserRowActions(row, {
      onDetails: (id) => navigate(userDetailPath(id)),
      onActivate: (id) => changeStatus(id, ROW_STATUS.ACTIVE),
      onSuspend: setSuspendTarget,
    });

  return {
    error: error && !usersLoading ? error : null,
    total: usersMeta.total || 0,
    rows,
    loading: usersLoading,
    tab,
    isSupplierTab: tab === USER_TAB.SUPPLIER,
    changeTab: (nextTab) => updateParams({ tab: nextTab, page: 1, plan: ALL, status: ALL }),
    search,
    changeSearch: setSearch,
    planFilter,
    changePlan: (value) => updateParams({ plan: value, page: 1 }),
    statusFilter,
    changeStatusFilter: (value) => updateParams({ status: value, page: 1 }),
    rowActions,
    pagination: {
      page: usersMeta.page || page,
      pageSize: usersMeta.pageSize || USERS_PAGE_SIZE,
      total: usersMeta.total || 0,
      onPageChange: (nextPage) => updateParams({ page: nextPage }),
    },
    suspend: {
      target: suspendTarget,
      close: () => setSuspendTarget(null),
      confirm: (reason) => {
        if (suspendTarget) {
          changeStatus(suspendTarget.id, ROW_STATUS.SUSPEND, reason);
          setSuspendTarget(null);
        }
      },
    },
  };
};
