import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { baseApi } from "@/api/baseApi";
import { useLogoutMutation } from "@/features/auth/api/auth.api";
import { setAuthenticated, setUser } from "@/features/auth/auth.slice";
import { clearSelectedConversation } from "@/features/conversations/conversation.slice";
import { removeToken } from "@/utils/token";

import SettingsCard from "../components/SettingsCard";
import AccountInfo from "../components/AccountInfo";

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      removeToken();
      dispatch(baseApi.util.resetApiState());
      dispatch(clearSelectedConversation());
      dispatch(setAuthenticated(false));
      dispatch(setUser(null));
      // NOTE: Assuming socket disconnects on unmount/auth state change.
      // Usually handled by SocketProvider.
      navigate("/login");
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-slate-950 px-4 py-8 overflow-y-auto sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Account Information Section */}
        <SettingsCard title="Account Information" description="Your personal account details.">
          <AccountInfo />
        </SettingsCard>

        {/* Appearance Placeholder */}
        <SettingsCard title="Appearance">
          <div className="flex items-center justify-between opacity-50 pointer-events-none">
            <div>
              <h4 className="text-base font-medium text-gray-200">Theme Preference</h4>
              <p className="text-sm text-gray-400">Choose between light and dark mode.</p>
            </div>
            <div className="px-3 py-1 bg-slate-800 rounded-md text-sm text-gray-300">Dark Mode</div>
          </div>
        </SettingsCard>

        {/* Notifications Placeholder */}
        <SettingsCard title="Notifications">
          <div className="flex items-center justify-between opacity-50 pointer-events-none">
            <div>
              <h4 className="text-base font-medium text-gray-200">Email Notifications</h4>
              <p className="text-sm text-gray-400">Receive emails about new messages.</p>
            </div>
            <div className="w-10 h-6 bg-blue-600 rounded-full relative">
              <div className="absolute right-1.5 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </SettingsCard>

        {/* Privacy Placeholder */}
        <SettingsCard title="Privacy & Security">
          <div className="space-y-4 opacity-50 pointer-events-none">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium text-gray-200">Change Password</h4>
                <p className="text-sm text-gray-400">Update your account password.</p>
              </div>
              <button className="px-4 py-1.5 bg-slate-800 text-sm font-medium text-white rounded-lg">Update</button>
            </div>
          </div>
        </SettingsCard>

        {/* Danger Zone / Logout */}
        <div className="rounded-xl border border-red-900/30 bg-red-950/10 overflow-hidden">
          <div className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-red-500">Log Out</h3>
              <p className="text-sm text-red-400/70 mt-1">
                Sign out of your account on this device.
              </p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isLoggingOut ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              )}
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
