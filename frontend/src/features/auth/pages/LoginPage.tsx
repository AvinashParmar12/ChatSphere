import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <AuthCard subtitle="Sign in to your account">
      <LoginForm />
      
      <div className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
          Register
        </Link>
      </div>
    </AuthCard>
  );
};

export default LoginPage;