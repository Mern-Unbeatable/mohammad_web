import { AlertCircle } from 'lucide-react';

/** Red alert box. */
const Notice = ({ children }) => (
  <div className="flex gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-left">
    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
    <div className="min-w-0 text-[14px] leading-[1.6] text-red-700">{children}</div>
  </div>
);

export default Notice;
