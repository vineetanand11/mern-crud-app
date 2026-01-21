import { Outlet } from "react-router-dom";
import { getUser, logout } from "../utils/auth";

export default function UsersLayout() {
  const user = getUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1025] via-[#14162e] to-[#0b0c1a] py-8 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">
            User Management
          </h1>
          <p className="text-white/70">
            Welcome, {user?.name}
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Child routes render here */}
      <Outlet />
    </div>
  );
}
