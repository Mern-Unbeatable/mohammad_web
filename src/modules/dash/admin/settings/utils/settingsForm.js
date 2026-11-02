export const priceText = (value) => (value === null || value === undefined ? "" : String(value));

/** Returns a non-negative number, or null when the input is not a valid price. */
export const parsePrice = (value) => {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const number = Number(text);
  return Number.isFinite(number) && number >= 0 ? number : null;
};

/** API tiers → editable rows with the price as text. */
export const toTierForm = (tiers) =>
  (Array.isArray(tiers) ? tiers : []).map((tier) => ({
    id: tier.id,
    label: tier.label,
    price: priceText(tier.price),
  }));

/** Editable rows → API tiers, plus the first row whose price is invalid (or undefined). */
export const toTierPayload = (rows) => {
  const tiers = rows.map((row) => ({ id: row.id, price: parsePrice(row.price) }));
  const invalid = rows.find((_, index) => tiers[index].price === null);
  return { tiers, invalid };
};

/** Appends the trimmed value unless it is blank or already listed. */
export const addUniqueCategory = (list, value) => {
  const trimmed = value.trim();
  if (!trimmed || list.includes(trimmed)) return list;
  return [...list, trimmed];
};

export const saveLabel = (saving, idle = "Save") => (saving ? "Saving…" : idle);
