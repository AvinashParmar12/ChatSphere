import ChatList from "@/features/conversations/components/ChatList";
import ChatWindow from "@/features/messages/components/ChatWindow";

const ChatsPage = () => {
  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-900 rounded-2xl border border-slate-800/40">
      <div className="w-[350px] shrink-0 border-r border-slate-800/40">
        <ChatList />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatsPage;
