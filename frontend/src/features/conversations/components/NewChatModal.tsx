import { useState, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { useSearchUsersQuery } from "@/features/users/api/user.api";
import { useConversations } from "../hooks/useConversations";
import { useCreateConversationMutation, conversationApi } from "../api/conversation.api";
import { setSelectedConversation } from "../conversation.slice";
import UserSearchItem from "@/features/users/components/UserSearchItem";
import type { User } from "@/features/auth/types/auth.types";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface NewChatModalProps {
  onClose: () => void;
}

const NewChatModal = ({ onClose }: NewChatModalProps) => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: searchResults, isFetching } = useSearchUsersQuery(debouncedSearch, {
    skip: debouncedSearch.trim() === "",
  });

  const { conversations } = useConversations();
  const [createConversation, { isLoading: isCreating }] = useCreateConversationMutation();

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleUserSelect = async (user: User) => {
    // 1. Check if conversation exists
    const existingConversation = conversations?.find(
      (conv) => !conv.isGroup && conv.participants.some((p) => p._id === user._id)
    );

    if (existingConversation) {
      dispatch(setSelectedConversation(existingConversation));
      onClose();
      return;
    }

    // 2. Create new conversation
    try {
      const response = await createConversation({ receiverId: user._id }).unwrap();
      const newConv = response.data;

      // Update RTK Query cache
      dispatch(
        conversationApi.util.updateQueryData("getConversations", undefined, (draft) => {
          draft.data.unshift(newConv);
        })
      );

      // Select new conversation and close
      onClose();
      dispatch(setSelectedConversation(newConv));
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h2 className="text-lg font-semibold text-white">New Chat</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <Input
            autoFocus
            type="text"
            placeholder="Search users by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full !bg-slate-800 !border-slate-700 !text-white placeholder:!text-slate-400"
          />
        </div>

        <div className="flex-1 overflow-y-auto max-h-[60vh] p-2 custom-scrollbar">
          {isFetching ? (
            <div className="flex justify-center p-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-600 border-t-blue-500"></div>
            </div>
          ) : searchResults?.data && searchResults.data.length > 0 ? (
            <div className="flex flex-col gap-1">
              {searchResults.data.map((user) => (
                <UserSearchItem
                  key={user._id}
                  user={user}
                  onClick={handleUserSelect}
                />
              ))}
            </div>
          ) : debouncedSearch.trim() !== "" ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No users found matching "{debouncedSearch}"
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-slate-500">
              Type to start searching
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
