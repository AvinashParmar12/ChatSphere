import { useState, useRef, useEffect } from "react";
import RenameGroupModal from "./RenameGroupModal";
import AddMembersModal from "./AddMembersModal";
import RemoveMembersModal from "./RemoveMembersModal";
import LeaveGroupDialog from "./LeaveGroupDialog";
import UpdateGroupAvatarDialog from "./UpdateGroupAvatarDialog";

const GroupHeaderMenu = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<
    "rename" | "add_members" | "remove_members" | "leave" | "avatar" | null
  >(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openModal = (modal: typeof activeModal) => {
    setActiveModal(modal);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-800 border border-slate-700 shadow-xl overflow-hidden z-40">
          <button
            onClick={() => openModal("avatar")}
            className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
          >
            Change Avatar
          </button>
          <button
            onClick={() => openModal("rename")}
            className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
          >
            Rename Group
          </button>
          <button
            onClick={() => openModal("add_members")}
            className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
          >
            Add Members
          </button>
          <button
            onClick={() => openModal("remove_members")}
            className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
          >
            Remove Members
          </button>
          <div className="h-px bg-slate-700/50 my-1"></div>
          <button
            onClick={() => openModal("leave")}
            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
          >
            Leave Group
          </button>
        </div>
      )}

      {/* Render Active Modal */}
      {activeModal === "rename" && <RenameGroupModal onClose={() => setActiveModal(null)} />}
      {activeModal === "add_members" && <AddMembersModal onClose={() => setActiveModal(null)} />}
      {activeModal === "remove_members" && <RemoveMembersModal onClose={() => setActiveModal(null)} />}
      {activeModal === "avatar" && <UpdateGroupAvatarDialog onClose={() => setActiveModal(null)} />}
      {activeModal === "leave" && <LeaveGroupDialog onClose={() => setActiveModal(null)} />}
    </div>
  );
};

export default GroupHeaderMenu;
