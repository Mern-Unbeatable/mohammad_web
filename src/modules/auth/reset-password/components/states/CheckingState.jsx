import { Loader2 } from 'lucide-react';

const CheckingState = () => (
  <div className="flex flex-col items-center gap-3 py-6 text-[14px] text-[#64748B]" role="status">
    <Loader2 className="h-7 w-7 animate-spin text-primary" />
    Verifying link...
  </div>
);

export default CheckingState;
