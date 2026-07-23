import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { useCreateGroupMutation } from "../api/group.api";
import { setSelectedConversation } from "@/features/conversations/conversation.slice";
import UserMultiSelect from "@/features/users/components/UserMultiSelect";
import type { User } from "@/features/auth/types/auth.types";
import Input from "@/components/ui/Input";

interface CreateGroupModalProps {
  onClose: () => void;
}

const CreateGroupModal = ({ onClose }: CreateGroupModalProps) => {
  const dispatch = useAppDispatch();
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [error, setError] = useState("");

  const [createGroup, { isLoading }] = useCreateGroupMutation();

  const handleCreate = async () => {
    if (groupName.trim().length < 3) {
      setError("Group name must be at least 3 characters.");
      return;
    }
    if (selectedUsers.length < 1) {
      setError("Please select at least one participant.");
      return;
    }

    try {
      const response = await createGroup({
        groupName: groupName.trim(),
        participants: selectedUsers.map((u) => u._id),
      }).unwrap();
      
      // Invalidate tags handles refetching, we just select it
      onClose();
      dispatch(setSelectedConversation(response.data));
    } catch (err: any) {
      setError(err?.data?.message || "Failed to create group");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h2 className="text-lg font-semibold text-white">Create Group</h2>
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
            <label className="block text-sm font-medium text-slate-300 mb-1">Group Name</label>
            <Input
              autoFocus
              type="text"
              placeholder="e.g. Engineering Team"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                setError("");
              }}
              className="w-full !bg-slate-800 !border-slate-700 !text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Participants</label>
            <UserMultiSelect
              selectedUsers={selectedUsers}
              onChange={(users) => {
                setSelectedUsers(users);
                setError("");
              }}
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
            onClick={handleCreate}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-lg shadow-blue-900/20"
          >
            {isLoading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
