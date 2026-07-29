import Card from "@/components/ui/Card";
import type { ReactNode } from "react";

interface AuthCardProps {
  subtitle: string;
  children: ReactNode;
}

const AuthCard = ({ subtitle, children }: AuthCardProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">ChatSphere</h1>
          <p className="mt-2 text-gray-500">{subtitle}</p>
        </div>
        {children}
      </Card>
    </div>
  );
};

export default AuthCard;
