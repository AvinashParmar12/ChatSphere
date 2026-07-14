import ConversationList from "@/features/conversations/components/ConversationList";

const DashboardPage = () => {
  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-900 rounded-2xl border border-slate-800/40">
      {/* Sidebar - Conversations List */}
      <div className="w-[350px] shrink-0 border-r border-slate-800/40">
        <ConversationList />
      </div>

      {/* Main Chat Area - Placeholder */}
      <div className="flex flex-1 flex-col items-center justify-center text-center p-6 bg-slate-900/40">
        <div className="max-w-md">
          {/* Visual Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-xl shadow-blue-500/5 animate-pulse">
            <svg
              className="h-10 w-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-3 bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
            Welcome to ChatSphere
          </h2>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Connect, converse, and collaborate in real-time. Select a chat
            from the sidebar or start a new conversation to get started.
          </p>

          {/* Info/Action placeholder */}
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/50 border border-slate-700/60 px-4 py-2 text-xs font-medium text-gray-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            Ready to start chatting
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
