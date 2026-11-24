import { createAsyncThunk } from "@reduxjs/toolkit";
import * as dashApi from "./dashApi";
import { mapDashboardPayload } from "./dashMappers";

/**
 * Supplier dashboard async thunks — orchestration only; HTTP in dashApi.
 */

// ═══════════════════════════════════════════════════════════════════════
// Overview (ads KPIs + recent ads + notifications)
// ═══════════════════════════════════════════════════════════════════════
export const fetchSupplierDashboard = createAsyncThunk(
  "supplierDashboard/fetchSupplierDashboard",
  async (yearArg, { rejectWithValue }) => {
    const year =
      typeof yearArg === "number" ? yearArg : new Date().getFullYear();
    try {
      const [adsResult, notificationsResult] = await Promise.all([
        dashApi.getMyAds({ page: 1, pageSize: 100, sort: "desc" }),
        dashApi.getNotifications({ page: 1, pageSize: 5, sort: "desc" }),
      ]);

      return mapDashboardPayload(
        {
          ads: adsResult.data || [],
          notifications: notificationsResult.data || [],
        },
        year,
      );
    } catch (err) {
      return rejectWithValue(
        dashApi.getApiErrorMessage(err, "Failed to load supplier dashboard"),
      );
    }
  },
);
