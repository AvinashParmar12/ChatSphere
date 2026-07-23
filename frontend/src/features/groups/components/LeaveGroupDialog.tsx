import { useState } from "react";
import { useLeaveGroupMutation } from "../api/group.api";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearSelectedConversation } from "@/features/conversations/conversation.slice";

interface LeaveGroupDialogProps {
  onClose: () => void;
}

const LeaveGroupDialog = ({ onClose }: LeaveGroupDialogProps) => {
  const selectedConversation = useAppSelector((state) => state.conversations.selectedConversation);
  const dispatch = useAppDispatch();
  
  const [error, setError] = useState("");
  const [leaveGroup, { isLoading }] = useLeaveGroupMutation();

  const handleLeave = async () => {
    if (!selectedConversation) return;

    try {
      await leaveGroup(selectedConversation._id).unwrap();
      dispatch(clearSelectedConversation());
      onClose();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to leave group");
    }
  };

  if (!selectedConversation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h2 className="text-lg font-semibold text-white">Leave Group</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <p className="text-slate-300 text-sm">
            Are you sure you want to leave <strong className="text-white">"{selectedConversation.groupName}"</strong>? 
            You will no longer receive messages from this group.
          </p>
        </div>

        <div className="border-t border-slate-800 p-4 flex justify-end gap-2 bg-slate-900">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLeave}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-red-600 text-white hover:bg-red-500 disabled:opacity-50 transition-colors shadow-lg shadow-red-900/20"
          >
            {isLoading ? "Leaving..." : "Leave Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveGroupDialog;
