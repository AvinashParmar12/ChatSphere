import ConversationList from "@/features/conversations/components/ConversationList";
import ChatWindow from "@/features/messages/components/ChatWindow";

const DashboardPage = () => {
  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-900 rounded-2xl border border-slate-800/40">
      {/* Sidebar - Conversations List */}
      <div className="w-[350px] shrink-0 border-r border-slate-800/40">
        <ConversationList />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <ChatWindow />
      </div>
    </div>
  );
};

export default DashboardPage;
