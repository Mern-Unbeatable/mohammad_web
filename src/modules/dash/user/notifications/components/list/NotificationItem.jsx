const NotificationItem = ({ item, onOpen }) => (
  <button
    type="button"
    onClick={() => onOpen(item)}
    className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-[#F9FAFB] sm:px-6"
  >
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.iconClass}`}
    >
      <item.icon className="h-[18px] w-[18px]" strokeWidth={2} />
    </span>

    <div className="min-w-0 flex-1">
      <p className="text-[14px] font-semibold leading-snug text-deep-blue">{item.title}</p>
      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#64748B]">
        {item.subtitle}
      </p>
      <p className="mt-2 text-[12px] text-[#98A2B3]">{item.time}</p>
    </div>

    {item.unread ? (
      <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" aria-label="Unread" />
    ) : null}
  </button>
);

export default NotificationItem;
