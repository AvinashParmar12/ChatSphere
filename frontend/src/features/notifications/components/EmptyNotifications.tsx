const EmptyNotifications = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-3 rounded-full bg-slate-800/50 p-3">
        <svg
          className="h-6 w-6 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </div>
      <h3 className="text-sm font-medium text-slate-300">No notifications</h3>
      <p className="mt-1 text-xs text-slate-500">
        You're all caught up! Check back later.
      </p>
    </div>
  );
};

export default EmptyNotifications;
