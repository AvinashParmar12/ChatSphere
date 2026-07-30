import toast from "react-hot-toast";
import { useUpdateAvatarMutation } from "../api/user.api";

export const useUpdateAvatar = () => {
  const [updateAvatarMutation, { isLoading }] = useUpdateAvatarMutation();

  const updateAvatar = async (file: File): Promise<boolean> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const previewUrl = URL.createObjectURL(file);

    try {
      await updateAvatarMutation({ formData, previewUrl }).unwrap();
      toast.success("Avatar updated successfully!");
      return true;
    } catch (error: any) {
      const message = error.data?.message || "Failed to upload avatar. Please try again.";
      toast.error(message);
      return false;
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return { updateAvatar, isLoading };
};
