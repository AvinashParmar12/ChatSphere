interface NotificationBadgeProps {
  count: number;
}

const NotificationBadge = ({ count }: NotificationBadgeProps) => {
  if (count === 0) return null;

  return (
    <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-900">
      {count > 99 ? "99+" : count}
    </span>
  );
};

export default NotificationBadge;
