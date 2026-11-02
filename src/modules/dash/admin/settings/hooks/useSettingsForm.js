import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  DEFAULT_GENERAL_CATEGORIES,
  DEFAULT_MARKETPLACE_CATEGORIES,
  SETTINGS_KEYS,
  saveAdminSetting,
} from "@/features/dash/admin/settings";
import {
  addUniqueCategory,
  parsePrice,
  priceText,
  toTierForm,
  toTierPayload,
} from "../utils/settingsForm";
import { MESSAGES } from "../constant/constants";

const useCategoryList = (initial, key, successMessage, save, savingKey) => {
  const [items, setItems] = useState(() => (Array.isArray(initial) ? initial : []));
  const [draft, setDraft] = useState("");

  return {
    items,
    draft,
    setDraft,
    add: () => {
      if (!draft.trim()) return;
      setItems((prev) => addUniqueCategory(prev, draft));
      setDraft("");
    },
    remove: (category) => setItems((prev) => prev.filter((item) => item !== category)),
    saving: savingKey === key,
    save: () => save(key, items, successMessage),
  };
};

/**
 * Editable copy of the loaded settings: subscription prices, sponsored tiers and
 * both category lists, each saved on its own. Mount with a key per load.
 */
export const useSettingsForm = (settings) => {
  const dispatch = useDispatch();
  const savingKey = useSelector((state) => state.adminSettings.savingKey);

  const subscription = settings[SETTINGS_KEYS.subscription];
  const marketCats = settings[SETTINGS_KEYS.marketplaceCategories];
  const generalCats = settings[SETTINGS_KEYS.generalCategories];

  const [monthlyPrice, setMonthlyPrice] = useState(() => priceText(subscription?.monthly));
  const [yearlyPrice, setYearlyPrice] = useState(() => priceText(subscription?.yearly));
  const [sponsoredTiers, setSponsoredTiers] = useState(() =>
    toTierForm(settings[SETTINGS_KEYS.sponsored]),
  );

  const saveSetting = async (key, value, successMessage) => {
    const result = await dispatch(saveAdminSetting({ key, value }));
    if (!saveAdminSetting.fulfilled.match(result)) return null;
    toast.success(successMessage);
    return result.payload.value;
  };

  const marketplace = useCategoryList(
    Array.isArray(marketCats) ? marketCats : DEFAULT_MARKETPLACE_CATEGORIES,
    SETTINGS_KEYS.marketplaceCategories,
    MESSAGES.MARKETPLACE_SAVED,
    saveSetting,
    savingKey,
  );
  const general = useCategoryList(
    Array.isArray(generalCats) ? generalCats : DEFAULT_GENERAL_CATEGORIES,
    SETTINGS_KEYS.generalCategories,
    MESSAGES.GENERAL_SAVED,
    saveSetting,
    savingKey,
  );

  const saveSubscription = async () => {
    const monthly = parsePrice(monthlyPrice);
    const yearly = parsePrice(yearlyPrice);
    if (monthly === null || yearly === null) {
      toast.error(MESSAGES.INVALID_SUBSCRIPTION);
      return;
    }
    const saved = await saveSetting(
      SETTINGS_KEYS.subscription,
      { monthly, yearly },
      MESSAGES.SUBSCRIPTION_SAVED,
    );
    if (saved) {
      setMonthlyPrice(priceText(saved.monthly));
      setYearlyPrice(priceText(saved.yearly));
    }
  };

  const saveSponsored = async () => {
    const { tiers, invalid } = toTierPayload(sponsoredTiers);
    if (invalid) {
      toast.error(MESSAGES.invalidTier(invalid.label));
      return;
    }
    const saved = await saveSetting(SETTINGS_KEYS.sponsored, tiers, MESSAGES.SPONSORED_SAVED);
    if (saved) setSponsoredTiers(toTierForm(saved));
  };

  const setTierPrice = (tierId, price) =>
    setSponsoredTiers((prev) =>
      prev.map((item) => (item.id === tierId ? { ...item, price } : item)),
    );

  return {
    subscription: {
      monthly: monthlyPrice,
      yearly: yearlyPrice,
      setMonthly: setMonthlyPrice,
      setYearly: setYearlyPrice,
      saving: savingKey === SETTINGS_KEYS.subscription,
      save: saveSubscription,
    },
    sponsored: {
      tiers: sponsoredTiers,
      setTierPrice,
      saving: savingKey === SETTINGS_KEYS.sponsored,
      save: saveSponsored,
    },
    marketplace,
    general,
  };
};
