import toast from "react-hot-toast";
import { useUpdateProfileMutation } from "../api/user.api";

export const useUpdateProfile = () => {
  const [updateProfileMutation, { isLoading }] = useUpdateProfileMutation();

  const updateProfile = async (data: { username: string; bio?: string }): Promise<boolean> => {
    try {
      await updateProfileMutation(data).unwrap();
      toast.success("Profile updated successfully!");
      return true;
    } catch (error: any) {
      const message = error.data?.message || "Failed to update profile. Please try again.";
      toast.error(message);
      return false;
    }
  };

  return { updateProfile, isLoading };
};
