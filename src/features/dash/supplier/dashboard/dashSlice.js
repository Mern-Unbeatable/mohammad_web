import { createSlice } from "@reduxjs/toolkit";
import { fetchSupplierDashboard } from "./dashThunks";

const emptyChart = {
  title: "Advertisement Performance",
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  yMax: 100,
  yTicks: [0, 25, 50, 75, 100],
  series: [
    { id: "views", label: "View", color: "#EC4899", values: Array(12).fill(0) },
    {
      id: "clicks",
      label: "Clicks",
      color: "#22C55E",
      values: Array(12).fill(0),
    },
  ],
};

const initialState = {
  stats: [],
  chart: emptyChart,
  recentAds: [],
  notifications: [],
  loading: false,
  error: null,
};

const dashSlice = createSlice({
  name: "supplierDashboard",
  initialState,
  reducers: {
    clearSupplierDashError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupplierDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupplierDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats || [];
        state.chart = action.payload.chart || emptyChart;
        state.recentAds = action.payload.recentAds || [];
        state.notifications = action.payload.notifications || [];
      })
      .addCase(fetchSupplierDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.stats = [];
        state.chart = emptyChart;
        state.recentAds = [];
        state.notifications = [];
      });
  },
});

export const { clearSupplierDashError } = dashSlice.actions;
export default dashSlice.reducer;
