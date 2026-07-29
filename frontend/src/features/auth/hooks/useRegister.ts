import { useRegisterMutation } from "../api/auth.api";
import type { RegisterFormData } from "../validation/register.schema";
import toast from "react-hot-toast";

export const useRegister = () => {
  const [registerMutation, { isLoading }] = useRegisterMutation();

  const register = async (data: RegisterFormData): Promise<boolean> => {
    try {
      // The backend expects username, email, password. We omit confirmPassword.
      await registerMutation({
        username: data.username,
        email: data.email,
        password: data.password,
      }).unwrap();

      toast.success("Registration successful! Please login.");
      return true;
    } catch (error: any) {
      console.error(error);
      const message = error.data?.message || "Registration failed. Please try again.";
      toast.error(message);
      return false;
    }
  };

  return {
    register,
    isLoading,
  };
};
