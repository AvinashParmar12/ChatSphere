import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";

import { useUpdateProfile } from "../hooks/useUpdateProfile";
import {
  profileSchema,
  type ProfileFormData,
} from "../validation/profile.schema";

const ProfileForm = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { updateProfile, isLoading } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });

  // Re-sync form if user state changes externally (e.g. rollback)
  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        bio: user.bio || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile({
      username: data.username,
      bio: data.bio,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter your username"
          error={!!errors.username}
          {...register("username")}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-500">
            {errors.username.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          placeholder="Write a short bio about yourself"
          className={`w-full rounded-lg border bg-white px-4 py-2 text-sm outline-none transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 ${
            errors.bio ? "border-red-500 focus:ring-red-500" : "border-gray-300"
          }`}
          rows={4}
          {...register("bio")}
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-red-500">
            {errors.bio.message}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 text-right">
          Max 200 characters
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <Button 
          type="submit" 
          loading={isLoading} 
          disabled={!isDirty || isLoading}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
