import { RefreshCw } from "lucide-react";
import Card from "@/components/ui/Card";
import {
  panelPageTheme,
  panelSecondaryBtn,
} from "@/components/layout/panelPageTheme";

const SettingsLoadError = ({ message, onRetry }) => (
  <Card className="flex flex-col items-center gap-3 px-4 py-10 text-center">
    <p className={panelPageTheme.cardBody}>{message}</p>
    <button type="button" onClick={onRetry} className={panelSecondaryBtn}>
      <RefreshCw className="mr-1.5 inline h-4 w-4" />
      Retry
    </button>
  </Card>
);

export default SettingsLoadError;
