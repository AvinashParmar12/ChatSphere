import { Outlet } from "react-router-dom";
import Sidebar from "@/features/dashboard/components/Sidebar";
import Topbar from "@/features/dashboard/components/Topbar";

const AppLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-white">
      {/* Sidebar - fixed width on desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-900 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;