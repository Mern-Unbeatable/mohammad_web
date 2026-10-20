import { useSearchParams } from "react-router";

/** Active activity tab from `?tab=` (first tab when missing or unknown); the first tab clears the param. */
export const useActivityTab = (tabs) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = tabs.find((tab) => tab.param === searchParams.get("tab")) || tabs[0];

  const setActive = (id) => {
    const next = tabs.find((tab) => tab.id === id);
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (next === tabs[0]) params.delete("tab");
        else params.set("tab", next.param);
        return params;
      },
      { replace: true },
    );
  };

  return { active, setActive };
};
