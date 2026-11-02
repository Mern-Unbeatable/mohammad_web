import { RefreshCw } from "lucide-react";

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center gap-3 rounded-xl border border-[#FEE4E2] bg-[#FFFBFA] px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
    <p className="text-[14px] font-medium text-[#B42318]">{message}</p>
    {onRetry ? (
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    ) : null}
  </div>
);

export default ErrorState;
