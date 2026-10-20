import { Pencil } from "lucide-react";
import { panelPrimaryBtn } from "@/components/layout/panelPageTheme";

const WelcomeBanner = ({ name, onCreateAd }) => (
  <div className="rounded-xl bg-deep-blue p-5 sm:p-6 lg:p-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-[24px] font-bold leading-tight text-white sm:text-[28px] lg:text-[32px]">
          Welcome back, {name}
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-white/70 sm:text-[15px] lg:text-[16px]">
          Here&apos;s an overview of your advertisements and activity
        </p>
      </div>
      <button
        type="button"
        onClick={onCreateAd}
        className={`${panelPrimaryBtn} w-full shrink-0 gap-2 sm:w-auto`}
      >
        <Pencil className="h-4 w-4" />
        Create A Advertisement
      </button>
    </div>
  </div>
);

export default WelcomeBanner;
