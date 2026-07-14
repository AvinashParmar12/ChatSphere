import Card from "@/components/ui/Card";

import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            ChatSphere
          </h1>

          <p className="mt-2 text-gray-500">
            Sign in to your account
          </p>
        </div>

        <LoginForm />
      </Card>
    </div>
  );
};

export default LoginPage;