import SettingsCard from "../components/SettingsCard";
import ProfileAvatar from "../components/ProfileAvatar";
import ProfileForm from "../components/ProfileForm";

const ProfilePage = () => {
  return (
    <div className="flex h-full w-full flex-col bg-slate-950 px-4 py-8 overflow-y-auto sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Profile</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your public profile and avatar.
          </p>
        </div>

        <SettingsCard title="Avatar">
          <ProfileAvatar />
        </SettingsCard>

        <SettingsCard 
          title="Profile Details" 
          description="Update your username and bio. This information will be visible to other users."
        >
          <ProfileForm />
        </SettingsCard>
      </div>
    </div>
  );
};

export default ProfilePage;
