import { useState, useRef } from "react";
import { useUpdateGroupAvatarMutation } from "../api/group.api";
import { useAppSelector } from "@/store/hooks";

interface UpdateGroupAvatarDialogProps {
  onClose: () => void;
}

const UpdateGroupAvatarDialog = ({ onClose }: UpdateGroupAvatarDialogProps) => {
  const selectedConversation = useAppSelector((state) => state.conversations.selectedConversation);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [updateAvatar, { isLoading }] = useUpdateGroupAvatarMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!selectedConversation) return;
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      await updateAvatar({
        groupId: selectedConversation._id,
        formData,
      }).unwrap();
      onClose();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to update avatar");
    }
  };

  if (!selectedConversation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h2 className="text-lg font-semibold text-white">Update Group Avatar</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 flex flex-col items-center gap-4">
          {error && <div className="text-red-400 text-sm w-full text-center">{error}</div>}
          
          <div className="relative group">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-800 border-2 border-dashed border-slate-600 overflow-hidden text-slate-500">
              {previewUrl || selectedConversation.groupAvatar ? (
                <img 
                  src={previewUrl || selectedConversation.groupAvatar} 
                  alt="Group Avatar" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium"
            >
              Choose Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <p className="text-xs text-slate-500">JPG, PNG or WEBP (Max 5MB)</p>
        </div>

        <div className="border-t border-slate-800 p-4 flex justify-end gap-2 bg-slate-900">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={isLoading || !selectedFile}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-lg shadow-blue-900/20"
          >
            {isLoading ? "Uploading..." : "Save Avatar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateGroupAvatarDialog;
