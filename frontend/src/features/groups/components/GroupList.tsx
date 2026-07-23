import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/store/hooks";
import { useConversations } from "@/features/conversations/hooks/useConversations";
import { setSelectedConversation } from "@/features/conversations/conversation.slice";
import { mapConversationToItem } from "@/features/conversations/utils/conversation.mapper";
import ConversationItem from "@/features/conversations/components/ConversationItem";
import ConversationSearch from "@/features/conversations/components/ConversationSearch";
import EmptyConversation from "@/features/conversations/components/EmptyConversation";
import CreateGroupModal from "./CreateGroupModal";

const GroupList = () => {
  const dispatch = useDispatch();
  const { conversations, isLoading, isError } = useConversations();
  const currentUser = useAppSelector((state) => state.auth.user);
  const selectedConversationId = useAppSelector(
    (state) => state.conversations.selectedConversationId
  );
  
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col bg-slate-900 border-r border-slate-800/60 overflow-hidden">
        <ConversationSearch onNewChat={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full w-full flex-col bg-slate-900 border-r border-slate-800/60 overflow-hidden">
        <ConversationSearch onNewChat={() => {}} />
        <div className="flex-1 flex items-center justify-center p-4 text-center">
          <p className="text-sm text-red-400">Failed to load groups</p>
        </div>
      </div>
    );
  }

  const mappedGroups = (conversations || [])
    .filter((conv) => conv.isGroup)
    .map((conversation) => {
      const mapped = mapConversationToItem(conversation, currentUser?._id);
      return {
        ...mapped,
        isActive: conversation._id === selectedConversationId,
        raw: conversation,
      };
    });

  return (
    <div className="flex h-full w-full flex-col bg-slate-900 border-r border-slate-800/60 overflow-hidden relative">
      {/* Search Header */}
      <ConversationSearch onNewChat={() => setIsCreateGroupModalOpen(true)} />

      {/* List Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {mappedGroups.length === 0 ? (
          <EmptyConversation />
        ) : (
          <div className="flex flex-col">
            {mappedGroups.map(({ raw, ...conversation }) => (
              <ConversationItem
                key={conversation.id}
                {...conversation}
                onClick={() => dispatch(setSelectedConversation(raw))}
              />
            ))}
          </div>
        )}
      </div>

      {isCreateGroupModalOpen && (
        <CreateGroupModal onClose={() => setIsCreateGroupModalOpen(false)} />
      )}
    </div>
  );
};

export default GroupList;
