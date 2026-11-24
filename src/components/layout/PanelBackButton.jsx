import { useLocation, useNavigate } from "react-router";
import BackLink from "./BackLink";

/** Goes back one history entry; opens `fallback` when the page was loaded directly. */
const PanelBackButton = ({ fallback, label = "Back", className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    if (location.key === "default" && fallback) navigate(fallback);
    else navigate(-1);
  };

  return (
    <BackLink onClick={goBack} className={className}>
      {label}
    </BackLink>
  );
};

export default PanelBackButton;
