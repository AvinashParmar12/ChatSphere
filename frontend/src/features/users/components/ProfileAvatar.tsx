import React, { useRef } from "react";
import { useAppSelector } from "@/store/hooks";
import Button from "@/components/ui/Button";
import { useUpdateAvatar } from "../hooks/useUpdateAvatar";
import toast from "react-hot-toast";

const ProfileAvatar = () => {
  const user = useAppSelector((state) => state.auth.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateAvatar, isLoading } = useUpdateAvatar();
  
  if (!user) return null;

  const initials = user.username ? user.username.substring(0, 2).toUpperCase() : "US";

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // File validation
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, PNG, and WEBP are allowed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 5MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    await updateAvatar(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleUploadClick();
    }
  };

  return (
    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
      <div 
        className="relative h-24 w-24 shrink-0 rounded-xl bg-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg overflow-hidden group cursor-pointer"
        onClick={handleUploadClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={isLoading ? -1 : 0}
        aria-label="Upload profile avatar"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={`${user.username}'s avatar`}
            className={`h-full w-full object-cover transition-opacity ${isLoading ? "opacity-50" : "opacity-100"}`}
          />
        ) : (
          <span className={isLoading ? "opacity-50" : "opacity-100"}>{initials}</span>
        )}
        
        {/* Hover Overlay */}
        <div 
          className={`absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${isLoading ? "hidden" : "flex"}`}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40" aria-busy="true" aria-label="Uploading avatar">
            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center sm:items-start flex-1 gap-2">
        <h4 className="font-medium text-gray-200">Profile Picture</h4>
        <p className="text-sm text-gray-500 text-center sm:text-left">
          Upload a new avatar. Large images will be resized automatically. Max size 5MB.
        </p>
        
        <input 
          type="file" 
          accept="image/jpeg, image/png, image/webp" 
          ref={fileInputRef} 
          onChange={handleFileChange}
          disabled={isLoading}
          className="hidden" 
          aria-hidden="true"
        />
        
        <div className="mt-2 flex gap-3">
          <Button 
            variant="primary" 
            onClick={handleUploadClick}
            disabled={isLoading}
            loading={isLoading}
            aria-label="Choose Image for Avatar"
          >
            Choose Image
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileAvatar;
