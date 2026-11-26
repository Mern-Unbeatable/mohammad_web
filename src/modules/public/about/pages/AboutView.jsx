import DocumentMeta from "@/modules/public/general/components/DocumentMeta";
import { ABOUT_PATH } from "../constant/constants";
import AboutHero from "../components/AboutHero";
import AboutMission from "../components/AboutMission";
import AboutPillars from "../components/AboutPillars";
import AboutCta from "../components/AboutCta";

const AboutView = () => (
  <div className="flex-1">
    <DocumentMeta
      title="About Lab Unity"
      description="Lab Unity is the professional network for the laboratory industry, operated by Global Medical Transport SRL in Belgium."
      canonicalPath={ABOUT_PATH}
    />
    <AboutHero />
    <AboutMission />
    <AboutPillars />
    <AboutCta />
  </div>
);

export default AboutView;
