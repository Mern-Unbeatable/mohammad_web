const NotificationItem = ({ item }) => {
  const Icon = item.icon;
  return (
    <li>
      <div className="flex items-start gap-3 px-5 py-4 sm:gap-4 sm:px-6">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${item.iconClass}`}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold leading-snug text-deep-blue sm:text-[15px]">
            {item.title}
          </p>
          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#64748B] sm:text-[14px]">
            {item.subtitle}
          </p>
          <p className="mt-2 text-[12px] text-[#98A2B3] sm:text-[13px]">{item.time}</p>
        </div>
      </div>
    </li>
  );
};

export default NotificationItem;
