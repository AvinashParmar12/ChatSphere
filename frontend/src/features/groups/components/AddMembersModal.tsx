import { useState } from "react";
import { useAddGroupMembersMutation } from "../api/group.api";
import { useAppSelector } from "@/store/hooks";
import UserMultiSelect from "@/features/users/components/UserMultiSelect";
import type { User } from "@/features/auth/types/auth.types";

interface AddMembersModalProps {
  onClose: () => void;
}

const AddMembersModal = ({ onClose }: AddMembersModalProps) => {
  const selectedConversation = useAppSelector((state) => state.conversations.selectedConversation);
  
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [error, setError] = useState("");

  const [addMembers, { isLoading }] = useAddGroupMembersMutation();

  const handleAddMembers = async () => {
    if (!selectedConversation) return;

    if (selectedUsers.length < 1) {
      setError("Please select at least one user to add.");
      return;
    }

    try {
      await addMembers({
        groupId: selectedConversation._id,
        participants: selectedUsers.map((u) => u._id),
      }).unwrap();
      onClose();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to add members");
    }
  };

  if (!selectedConversation) return null;

  // Existing member IDs to exclude from search
  const existingMemberIds = selectedConversation.participants.map((p) => p._id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h2 className="text-lg font-semibold text-white">Add Members</h2>
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
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Search Users</label>
            <UserMultiSelect
              selectedUsers={selectedUsers}
              onChange={(users) => {
                setSelectedUsers(users);
                setError("");
              }}
              excludeUserIds={existingMemberIds}
              placeholder="Search users to add..."
            />
          </div>
        </div>

        <div className="border-t border-slate-800 p-4 flex justify-end gap-2 bg-slate-900">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddMembers}
            disabled={isLoading || selectedUsers.length === 0}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-lg shadow-blue-900/20"
          >
            {isLoading ? "Adding..." : "Add Members"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMembersModal;
