import { Ban, CheckCircle2, Loader2 } from "lucide-react";
import Card from "@/components/ui/Card";
import { accountRows, accountStatus, statusText } from "../../utils/userDetail";
import { ACCOUNT_STATUS_CLASS, API_STATUS } from "../../constant/constants";

/** Admin-only sidebar card: status, account facts and a Suspend / Activate button. */
const AccountDetailsCard = ({ user, updating, onSuspend, onActivate }) => {
  const status = accountStatus(user);
  const isActive = status === API_STATUS.ACTIVE;

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-primary bg-primary px-5 py-4 sm:px-6">
        <h2 className="text-[16px] font-bold text-white">Account details</h2>
        <p className="mt-1 text-[13px] text-white/80">
          Visible to admins only.
        </p>
      </div>
      <dl className="divide-y divide-[#E4E7EC] px-5 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-3.5">
          <dt className="text-[13px] text-[#64748B]">Status</dt>
          <dd>
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                ACCOUNT_STATUS_CLASS[status] || ACCOUNT_STATUS_CLASS.ACTIVE
              }`}
            >
              {statusText(status)}
            </span>
          </dd>
        </div>
        {accountRows(user).map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 py-3.5"
          >
            <dt className="text-[13px] text-[#64748B]">{label}</dt>
            <dd className="text-right text-[13px] font-semibold text-deep-blue">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-[#E4E7EC] px-5 py-4 sm:px-6">
        {isActive ? (
          <button
            type="button"
            onClick={onSuspend}
            disabled={updating}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#D92D20] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#B42318] disabled:cursor-wait disabled:opacity-60"
          >
            {updating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Ban className="h-4 w-4" />
            )}
            Suspend user
          </button>
        ) : (
          <button
            type="button"
            onClick={onActivate}
            disabled={updating}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#079455] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#067647] disabled:cursor-wait disabled:opacity-60"
          >
            {updating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Activate user
          </button>
        )}
      </div>
    </Card>
  );
};

export default AccountDetailsCard;
