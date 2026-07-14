import { useDispatch } from "react-redux";
import { useAppSelector } from "@/store/hooks";
import { useConversations } from "../hooks/useConversations";
import { setSelectedConversation } from "../conversation.slice";
import { mapConversationToItem } from "../utils/conversation.mapper";
import ConversationItem from "./ConversationItem";
import ConversationSearch from "./ConversationSearch";
import EmptyConversation from "./EmptyConversation";

const ConversationList = () => {
  const dispatch = useDispatch();
  const { conversations, isLoading, isError } = useConversations();
  const currentUser = useAppSelector((state) => state.auth.user);
  const selectedConversationId = useAppSelector(
    (state) => state.conversations.selectedConversationId
  );

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col bg-slate-900 border-r border-slate-800/60 overflow-hidden">
        <ConversationSearch />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full w-full flex-col bg-slate-900 border-r border-slate-800/60 overflow-hidden">
        <ConversationSearch />
        <div className="flex-1 flex items-center justify-center p-4 text-center">
          <p className="text-sm text-red-400">Failed to load conversations</p>
        </div>
      </div>
    );
  }

  const mappedConversations = (conversations || []).map((conversation) => {
    const mapped = mapConversationToItem(conversation, currentUser?._id);
    return {
      ...mapped,
      isActive: conversation._id === selectedConversationId,
      raw: conversation,
    };
  });

  return (
    <div className="flex h-full w-full flex-col bg-slate-900 border-r border-slate-800/60 overflow-hidden">
      {/* Search Header */}
      <ConversationSearch />

      {/* List Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {mappedConversations.length === 0 ? (
          <EmptyConversation />
        ) : (
          <div className="flex flex-col">
            {mappedConversations.map(({ raw, ...conversation }) => (
              <ConversationItem
                key={conversation.id}
                {...conversation}
                onClick={() => dispatch(setSelectedConversation(raw))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
