const NotificationPreviewItem = ({ item, onOpen }) => {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F9FAFB]"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.iconClass}`}
      >
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-[13px] font-semibold text-deep-blue">
          {item.title}
        </p>
        {item.subtitle ? (
          <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-[#64748B]">
            {item.subtitle}
          </p>
        ) : null}
        <p className="mt-1 text-[11px] text-[#98A2B3]">{item.time}</p>
      </div>
      {item.unread ? (
        <span
          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
          aria-label="Unread"
        />
      ) : null}
    </button>
  );
};

export default NotificationPreviewItem;
