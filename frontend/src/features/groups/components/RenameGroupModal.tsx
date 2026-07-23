import { useState } from "react";
import { useRenameGroupMutation } from "../api/group.api";
import { useAppSelector } from "@/store/hooks";
import Input from "@/components/ui/Input";

interface RenameGroupModalProps {
  onClose: () => void;
}

const RenameGroupModal = ({ onClose }: RenameGroupModalProps) => {
  const selectedConversation = useAppSelector((state) => state.conversations.selectedConversation);
  
  const [groupName, setGroupName] = useState(selectedConversation?.groupName || "");
  const [error, setError] = useState("");

  const [renameGroup, { isLoading }] = useRenameGroupMutation();

  const handleRename = async () => {
    if (!selectedConversation) return;
    
    if (groupName.trim().length < 3) {
      setError("Group name must be at least 3 characters.");
      return;
    }

    if (groupName.trim() === selectedConversation.groupName) {
      onClose();
      return;
    }

    try {
      await renameGroup({
        groupId: selectedConversation._id,
        groupName: groupName.trim(),
      }).unwrap();
      onClose();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to rename group");
    }
  };

  if (!selectedConversation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h2 className="text-lg font-semibold text-white">Rename Group</h2>
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
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">New Group Name</label>
            <Input
              autoFocus
              type="text"
              placeholder="Enter new group name..."
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                setError("");
              }}
              className="w-full !bg-slate-800 !border-slate-700 !text-white"
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
            onClick={handleRename}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-lg shadow-blue-900/20"
          >
            {isLoading ? "Saving..." : "Save Name"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameGroupModal;
