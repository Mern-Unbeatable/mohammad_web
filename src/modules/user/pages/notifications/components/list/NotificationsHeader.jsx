const NotificationsHeader = ({ onMarkAllRead, disabled }) => (
  <div className="flex items-center justify-between gap-4 border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
    <h1 className="text-[22px] font-bold text-deep-blue sm:text-[24px]">Notifications</h1>
    <button
      type="button"
      onClick={onMarkAllRead}
      disabled={disabled}
      className="shrink-0 rounded-lg border border-[#E4E7EC] px-3 py-1.5 text-[12px] font-semibold text-[#475467] hover:bg-[#F9FAFB] disabled:opacity-60"
    >
      Mark all as read
    </button>
  </div>
);

export default NotificationsHeader;
