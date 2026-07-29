import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <AuthCard subtitle="Create a new account">
      <RegisterForm />
      
      <div className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
          Login
        </Link>
      </div>
    </AuthCard>
  );
};

export default RegisterPage;
