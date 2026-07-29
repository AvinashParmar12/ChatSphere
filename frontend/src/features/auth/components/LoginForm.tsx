import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";

import {
  loginSchema,
  type LoginFormData,
} from "../validation/login.schema";



const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isLoading } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: location.state?.email || "",
      password: "",
    },
  });

const onSubmit = async (
  data: LoginFormData
) => {
  const success = await login(data);

  if (success) {
    navigate("/dashboard");
  }
};

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* Email */}
      <div>
        <Label htmlFor="email">
          Email
        </Label>

        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          error={!!errors.email}
          {...register("email")}
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <Label htmlFor="password">
          Password
        </Label>

        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          error={!!errors.password}
          {...register("password")}
        />

        {errors.password && (
          <p className="mt-1 text-sm text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
  type="submit"
  className="w-full"
  loading={isLoading}
>
  Login
</Button>
    </form>
  );
};

export default LoginForm;