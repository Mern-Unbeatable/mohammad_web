import { AdminSettingsSkeleton } from "@/components/loader";
import PanelPage from "@/components/layout/PanelPage";
import PanelPageHeader from "@/components/layout/PanelPageHeader";
import SettingsLoadError from "../components/common/SettingsLoadError";
import SubscriptionSection from "../components/sections/SubscriptionSection";
import SponsoredSection from "../components/sections/SponsoredSection";
import CategorySection from "../components/sections/CategorySection";
import { useAdminSettings } from "../hooks/useAdminSettings";
import { useSettingsForm } from "../hooks/useSettingsForm";
import { PAGE_SUBTITLE, PAGE_TITLE } from "../constant/constants";

const PAGE_HEADER = <PanelPageHeader title={PAGE_TITLE} subtitle={PAGE_SUBTITLE} />;

/** Form state is seeded from `settings` once; the parent remounts it per load via `key`. */
const SettingsEditor = ({ settings }) => {
  const form = useSettingsForm(settings);

  return (
    <PanelPage>
      {PAGE_HEADER}
      <SubscriptionSection subscription={form.subscription} />
      <SponsoredSection sponsored={form.sponsored} />
      <CategorySection title="Marketplace category" list={form.marketplace} />
      <CategorySection title="General category" list={form.general} />
    </PanelPage>
  );
};

const AdminSettingsView = () => {
  const { status, error, reload, settings, formKey } = useAdminSettings();

  if (status === "ready") return <SettingsEditor key={formKey} settings={settings} />;

  return (
    <PanelPage>
      {PAGE_HEADER}
      {status === "error" ? (
        <SettingsLoadError message={error} onRetry={reload} />
      ) : (
        <AdminSettingsSkeleton />
      )}
    </PanelPage>
  );
};

export default AdminSettingsView;
