import { useLocation, useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";

/** Goes back one history entry; opens `fallback` when the page was loaded directly. */
const PanelBackButton = ({ fallback, label = "Back", className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    if (location.key === "default" && fallback) navigate(fallback);
    else navigate(-1);
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className={`inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary ${className}`}
    >
      <ChevronLeft className="h-4 w-4" />
      {label}
    </button>
  );
};

export default PanelBackButton;
