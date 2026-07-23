import { useState } from "react";
import { useRemoveGroupMembersMutation } from "../api/group.api";
import { useAppSelector } from "@/store/hooks";

interface RemoveMembersModalProps {
  onClose: () => void;
}

const RemoveMembersModal = ({ onClose }: RemoveMembersModalProps) => {
  const selectedConversation = useAppSelector((state) => state.conversations.selectedConversation);
  const currentUser = useAppSelector((state) => state.auth.user);
  
  const [error, setError] = useState("");
  const [removeMembers, { isLoading }] = useRemoveGroupMembersMutation();

  if (!selectedConversation || !currentUser) return null;

  // Filter out the current user, because they should use LeaveGroupDialog instead
  const removableMembers = selectedConversation.participants.filter(
    (p) => p._id !== currentUser._id
  );

  const handleRemove = async (userId: string) => {
    try {
      await removeMembers({
        groupId: selectedConversation._id,
        participants: [userId],
      }).unwrap();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to remove member");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h2 className="text-lg font-semibold text-white">Remove Members</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {error && <div className="text-red-400 text-sm">{error}</div>}
          
          {removableMembers.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No other members in this group.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {removableMembers.map((member) => (
                <div key={member._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 text-white overflow-hidden text-xs">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.username} className="h-full w-full object-cover" />
                      ) : (
                        member.username.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-200">{member.username}</span>
                      <span className="text-xs text-slate-500">{member.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(member._id)}
                    disabled={isLoading}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveMembersModal;
