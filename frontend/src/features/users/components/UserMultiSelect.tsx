import { useState, useEffect } from "react";
import type { User } from "@/features/auth/types/auth.types";
import { useSearchUsersQuery } from "@/features/users/api/user.api";
import Input from "@/components/ui/Input";
import UserSearchItem from "./UserSearchItem";

interface UserMultiSelectProps {
  selectedUsers: User[];
  onChange: (users: User[]) => void;
  excludeUserIds?: string[];
  placeholder?: string;
}

const UserMultiSelect = ({
  selectedUsers,
  onChange,
  excludeUserIds = [],
  placeholder = "Search users by name...",
}: UserMultiSelectProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: searchResults, isFetching } = useSearchUsersQuery(debouncedSearch, {
    skip: debouncedSearch.trim() === "",
  });

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const toggleUser = (user: User) => {
    const isSelected = selectedUsers.some((u) => u._id === user._id);
    if (isSelected) {
      onChange(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      onChange([...selectedUsers, user]);
    }
    // Optionally clear search term after selection
    setSearchTerm("");
  };

  const removeUser = (userId: string) => {
    onChange(selectedUsers.filter((u) => u._id !== userId));
  };

  // Filter out excluded users from search results
  const filteredResults = searchResults?.data?.filter(
    (u) => !excludeUserIds.includes(u._id)
  ) || [];

  return (
    <div className="flex flex-col gap-4">
      {/* Selected Users Chips */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-2 rounded-full bg-blue-600/20 px-3 py-1.5 text-sm font-medium text-blue-400 border border-blue-500/20"
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600/50 text-white overflow-hidden text-[10px]">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                ) : (
                  user.username.substring(0, 2).toUpperCase()
                )}
              </div>
              <span className="truncate max-w-[100px]">{user.username}</span>
              <button
                type="button"
                onClick={() => removeUser(user._id)}
                className="text-blue-400 hover:text-white transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Input */}
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full !bg-slate-800 !border-slate-700 !text-white placeholder:!text-slate-400"
      />

      {/* Search Results Dropdown-like Area */}
      {debouncedSearch.trim() !== "" && (
        <div className="flex flex-col overflow-y-auto max-h-[250px] p-2 custom-scrollbar rounded-xl border border-slate-700 bg-slate-800/50">
          {isFetching ? (
            <div className="flex justify-center p-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-blue-500"></div>
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="flex flex-col gap-1">
              {filteredResults.map((user) => {
                const isSelected = selectedUsers.some((u) => u._id === user._id);
                return (
                  <div key={user._id} className="relative">
                    <UserSearchItem
                      user={user}
                      onClick={() => toggleUser(user)}
                    />
                    {/* Visual indicator if selected */}
                    {isSelected && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-slate-500">
              No users found matching "{debouncedSearch}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMultiSelect;
