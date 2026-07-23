import Input from "@/components/ui/Input";

interface ConversationSearchProps {
  onNewChat: () => void;
}

const ConversationSearch = ({ onNewChat }: ConversationSearchProps) => {
  return (
    <div className="relative flex w-full items-center gap-2 p-4 border-b border-slate-800/50">
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
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
      <button
        onClick={onNewChat}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
        title="Start New Chat"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default ConversationSearch;
