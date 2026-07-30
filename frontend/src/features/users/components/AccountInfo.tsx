import { useAppSelector } from "@/store/hooks";
import toast from "react-hot-toast";

const AccountInfo = () => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(user._id);
    toast.success("User ID copied to clipboard!");
  };

  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-400">Username</h4>
          <p className="mt-1 text-base text-gray-100">{user.username}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-400">Email</h4>
          <p className="mt-1 text-base text-gray-100">{user.email}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-400">Joined Date</h4>
          <p className="mt-1 text-base text-gray-100">{formatDate(user.createdAt)}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-400">Online Status</h4>
          <div className="mt-1 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <span className="text-base text-gray-100">Online</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-400">Bio</h4>
        <p className="mt-1 text-base text-gray-100">
          {user.bio || <span className="text-gray-600 italic">No bio provided</span>}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <h4 className="text-sm font-medium text-gray-400">User ID</h4>
        <div className="mt-2 flex items-center gap-3">
          <code className="px-3 py-1.5 bg-slate-950 rounded-lg text-sm text-blue-400 border border-slate-800/60 font-mono">
            {user._id}
          </code>
          <button 
            onClick={handleCopyId}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title="Copy ID"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
