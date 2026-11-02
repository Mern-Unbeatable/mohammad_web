import { Loader2 } from "lucide-react";

const JobFormLoading = () => (
  <div className="flex h-64 items-center justify-center rounded-xl bg-white shadow-sm">
    <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
    <span className="text-[14px] font-medium text-[#64748B]">Loading job…</span>
  </div>
);

export default JobFormLoading;
