import { Outlet } from "react-router-dom";

const GuestLayout = () => {
  return (
    <main className="min-h-screen bg-gray-100">
      <Outlet />
    </main>
  );
};

export default GuestLayout;