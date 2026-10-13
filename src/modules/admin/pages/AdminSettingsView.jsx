import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calculator, Check, RefreshCw, Trash2, Wallet } from "lucide-react";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import { AdminSettingsSkeleton } from "@/components/common/Skeleton";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelPageHeader from "@/shared/layout/PanelLayout/PanelPageHeader";
import {
  panelPageTheme,
  panelPrimaryBtn,
  panelSecondaryBtn,
} from "@/shared/layout/PanelLayout/panelPageTheme";
import {
  fetchAdminSettings,
  saveAdminSetting,
  clearSettingsError,
  SETTINGS_KEYS,
  SUBSCRIPTION_FEATURES,
  DEFAULT_MARKETPLACE_CATEGORIES,
  DEFAULT_GENERAL_CATEGORIES,
} from "@/features/admin/settings";

const inputClass =
  "w-full rounded-lg border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 lg:text-[15px]";

const CategoryTag = ({ label, onRemove }) => (
  <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-green-secondary bg-green-secondary/40 px-3 py-1.5 text-[12px] font-semibold text-green-primary sm:text-[13px] lg:text-[14px]">
    <span className="truncate">{label}</span>
    <button
      type="button"
      onClick={onRemove}
      className="shrink-0 rounded p-0.5 text-pink-light hover:bg-pink-secondary/50"
      aria-label={`Remove ${label}`}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  </span>
);

const PriceField = ({ id, label, value, onChange }) => (
  <div className="min-w-0">
    <label
      htmlFor={id}
      className={`mb-1.5 block ${panelPageTheme.cardBody} font-medium`}
    >
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={onChange}
        className={inputClass}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[#64748B]">
        €
      </span>
    </div>
  </div>
);

const priceText = (value) =>
  value === null || value === undefined ? "" : String(value);

/** Returns a non-negative number, or null when the input is not a valid price. */
const parsePrice = (value) => {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const number = Number(text);
  return Number.isFinite(number) && number >= 0 ? number : null;
};

const toTierForm = (tiers) =>
  (Array.isArray(tiers) ? tiers : []).map((tier) => ({
    id: tier.id,
    label: tier.label,
    price: priceText(tier.price),
  }));

const PAGE_HEADER = (
  <PanelPageHeader
    title="Settings"
    subtitle="Manage your subscription and Sponsored Price"
  />
);

const AdminSettingsView = () => {
  const dispatch = useDispatch();
  const { settings, loading, loadedRequestId, error, saveError } = useSelector(
    (state) => state.adminSettings,
  );

  const loadSettings = useCallback(() => {
    dispatch(clearSettingsError());
    dispatch(fetchAdminSettings());
  }, [dispatch]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (saveError) toast.error(saveError);
  }, [saveError]);

  if (!loadedRequestId && error && !loading) {
    return (
      <PanelPage>
        {PAGE_HEADER}
        <Card className="flex flex-col items-center gap-3 px-4 py-10 text-center">
          <p className={panelPageTheme.cardBody}>{error}</p>
          <button
            type="button"
            onClick={loadSettings}
            className={panelSecondaryBtn}
          >
            <RefreshCw className="mr-1.5 inline h-4 w-4" />
            Retry
          </button>
        </Card>
      </PanelPage>
    );
  }

  if (loading || !loadedRequestId) {
    return (
      <PanelPage>
        {PAGE_HEADER}
        <AdminSettingsSkeleton />
      </PanelPage>
    );
  }

  return <AdminSettingsForm key={loadedRequestId} settings={settings} />;
};

const AdminSettingsForm = ({ settings }) => {
  const dispatch = useDispatch();
  const savingKey = useSelector((state) => state.adminSettings.savingKey);

  const subscription = settings[SETTINGS_KEYS.subscription];
  const marketCats = settings[SETTINGS_KEYS.marketplaceCategories];
  const generalCats = settings[SETTINGS_KEYS.generalCategories];

  const [monthlyPrice, setMonthlyPrice] = useState(() =>
    priceText(subscription?.monthly),
  );
  const [yearlyPrice, setYearlyPrice] = useState(() =>
    priceText(subscription?.yearly),
  );
  const [sponsoredTiers, setSponsoredTiers] = useState(() =>
    toTierForm(settings[SETTINGS_KEYS.sponsored]),
  );
  const [marketplaceCategories, setMarketplaceCategories] = useState(() =>
    Array.isArray(marketCats) ? marketCats : DEFAULT_MARKETPLACE_CATEGORIES,
  );
  const [generalCategories, setGeneralCategories] = useState(() =>
    Array.isArray(generalCats) ? generalCats : DEFAULT_GENERAL_CATEGORIES,
  );
  const [newMarketplaceCategory, setNewMarketplaceCategory] = useState("");
  const [newGeneralCategory, setNewGeneralCategory] = useState("");

  const saveSetting = async (key, value, successMessage) => {
    const result = await dispatch(saveAdminSetting({ key, value }));
    if (!saveAdminSetting.fulfilled.match(result)) return null;
    toast.success(successMessage);
    return result.payload.value;
  };

  const saveSubscription = async () => {
    const monthly = parsePrice(monthlyPrice);
    const yearly = parsePrice(yearlyPrice);
    if (monthly === null || yearly === null) {
      toast.error("Enter a valid monthly and yearly price.");
      return;
    }
    const saved = await saveSetting(
      SETTINGS_KEYS.subscription,
      { monthly, yearly },
      "Subscription pricing saved",
    );
    if (saved) {
      setMonthlyPrice(priceText(saved.monthly));
      setYearlyPrice(priceText(saved.yearly));
    }
  };

  const saveSponsored = async () => {
    const tiers = sponsoredTiers.map((tier) => ({
      id: tier.id,
      price: parsePrice(tier.price),
    }));
    const invalid = sponsoredTiers.find((_, index) => tiers[index].price === null);
    if (invalid) {
      toast.error(`Enter a valid price for ${invalid.label}.`);
      return;
    }
    const saved = await saveSetting(
      SETTINGS_KEYS.sponsored,
      tiers,
      "Sponsored pricing saved",
    );
    if (saved) setSponsoredTiers(toTierForm(saved));
  };

  const addCategory = (value, setter, listSetter) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    listSetter((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setter("");
  };

  return (
    <PanelPage>
      {PAGE_HEADER}

      <Card className="overflow-hidden">
        <div className="flex items-start gap-3 border-b border-[#E4E7EC] px-4 py-3.5 sm:px-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
            <Wallet className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h2 className={panelPageTheme.cardTitle}>
              Manage Your Subscription
            </h2>
            <p className={panelPageTheme.cardSubtitle}>
              Edit and Delete your subscription package.
            </p>
          </div>
        </div>

        <div className="space-y-4 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
              <PriceField
                id="monthly-price"
                label="Monthly"
                value={monthlyPrice}
                onChange={(event) => setMonthlyPrice(event.target.value)}
              />
              <PriceField
                id="yearly-price"
                label="Yearly"
                value={yearlyPrice}
                onChange={(event) => setYearlyPrice(event.target.value)}
              />
            </div>
            <button
              type="button"
              disabled={savingKey === SETTINGS_KEYS.subscription}
              onClick={saveSubscription}
              className={`${panelPrimaryBtn} w-full lg:w-auto lg:shrink-0 disabled:opacity-60`}
            >
              {savingKey === SETTINGS_KEYS.subscription ? "Saving…" : "Save"}
            </button>
          </div>

          <div className="rounded-xl border border-secondary bg-secondary/30 p-3.5 sm:p-4">
            <p className={`mb-2.5 ${panelPageTheme.cardEyebrow}`}>
              Everything included
            </p>
            <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {SUBSCRIPTION_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className={`flex items-start gap-2 ${panelPageTheme.cardBody}`}
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-green-primary"
                    strokeWidth={2.5}
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-start gap-3 border-b border-[#E4E7EC] px-4 py-3.5 sm:px-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FEF3E8] text-[#E67E22]">
            <Calculator className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h2 className={panelPageTheme.cardTitle}>Sponsored Post Pricing</h2>
            <p className={panelPageTheme.cardSubtitle}>
              Manage Sponsored post pricing.
            </p>
          </div>
        </div>

        <div className="space-y-3 px-4 py-4 sm:px-5">
          {sponsoredTiers.map((tier) => (
            <div
              key={tier.id}
              className="flex flex-col gap-3 border-b border-[#F4F5F7] pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-end"
            >
              <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label
                    className={`mb-1.5 block ${panelPageTheme.cardBody} font-medium`}
                  >
                    Day
                  </label>
                  <input
                    type="text"
                    value={tier.label}
                    readOnly
                    className={inputClass}
                  />
                </div>
                <PriceField
                  id={`price-${tier.id}`}
                  label="Price"
                  value={tier.price}
                  onChange={(event) =>
                    setSponsoredTiers((prev) =>
                      prev.map((item) =>
                        item.id === tier.id
                          ? { ...item, price: event.target.value }
                          : item,
                      ),
                    )
                  }
                />
              </div>
              <button
                type="button"
                disabled={savingKey === SETTINGS_KEYS.sponsored}
                onClick={saveSponsored}
                className={`${panelPrimaryBtn} w-full sm:w-auto sm:shrink-0 disabled:opacity-60`}
              >
                {savingKey === SETTINGS_KEYS.sponsored ? "Saving…" : "Save"}
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 sm:p-5">
        <div className="mb-3 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className={panelPageTheme.cardTitle}>Marketplace category</h2>
            <button
              type="button"
              disabled={savingKey === SETTINGS_KEYS.marketplaceCategories}
              onClick={() =>
                saveSetting(
                  SETTINGS_KEYS.marketplaceCategories,
                  marketplaceCategories,
                  "Marketplace categories saved",
                )
              }
              className={`${panelPrimaryBtn} disabled:opacity-60`}
            >
              {savingKey === SETTINGS_KEYS.marketplaceCategories
                ? "Saving…"
                : "Save categories"}
            </button>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              value={newMarketplaceCategory}
              onChange={(event) => setNewMarketplaceCategory(event.target.value)}
              placeholder="New category"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() =>
                addCategory(
                  newMarketplaceCategory,
                  setNewMarketplaceCategory,
                  setMarketplaceCategories,
                )
              }
              className={`${panelPrimaryBtn} w-full sm:w-auto sm:shrink-0`}
            >
              Add Category
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {marketplaceCategories.map((category) => (
            <CategoryTag
              key={category}
              label={category}
              onRemove={() =>
                setMarketplaceCategories((prev) =>
                  prev.filter((item) => item !== category),
                )
              }
            />
          ))}
        </div>
      </Card>

      <Card className="p-4 sm:p-5">
        <div className="mb-3 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className={panelPageTheme.cardTitle}>General category</h2>
            <button
              type="button"
              disabled={savingKey === SETTINGS_KEYS.generalCategories}
              onClick={() =>
                saveSetting(
                  SETTINGS_KEYS.generalCategories,
                  generalCategories,
                  "General categories saved",
                )
              }
              className={`${panelPrimaryBtn} disabled:opacity-60`}
            >
              {savingKey === SETTINGS_KEYS.generalCategories
                ? "Saving…"
                : "Save categories"}
            </button>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              value={newGeneralCategory}
              onChange={(event) => setNewGeneralCategory(event.target.value)}
              placeholder="New category"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() =>
                addCategory(
                  newGeneralCategory,
                  setNewGeneralCategory,
                  setGeneralCategories,
                )
              }
              className={`${panelPrimaryBtn} w-full sm:w-auto sm:shrink-0`}
            >
              Add Category
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {generalCategories.map((category) => (
            <CategoryTag
              key={category}
              label={category}
              onRemove={() =>
                setGeneralCategories((prev) =>
                  prev.filter((item) => item !== category),
                )
              }
            />
          ))}
        </div>
      </Card>
    </PanelPage>
  );
};

export default AdminSettingsView;
