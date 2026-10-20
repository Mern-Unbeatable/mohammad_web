import { Loader2 } from "lucide-react";

const Spinner = () => (
  <div className="flex justify-center py-10 text-[#98A2B3]">
    <Loader2 className="h-5 w-5 animate-spin" />
  </div>
);

export default Spinner;
