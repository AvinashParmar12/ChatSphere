import Input from "@/components/ui/Input";

const ConversationSearch = () => {
  return (
    <div className="relative w-full p-4 border-b border-slate-800/50">
      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center pl-3">
        <svg
          className="h-4 w-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <Input
        type="text"
        placeholder="Search conversations..."
        className="pl-10 !bg-slate-900/50 !border-slate-800/80 !text-white placeholder:!text-slate-500 focus:!border-blue-500/50 focus:!ring-blue-500/20"
      />
    </div>
  );
};

export default ConversationSearch;
