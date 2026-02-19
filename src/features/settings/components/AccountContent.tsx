import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Shield, Info, UserLock } from "lucide-react";
import toast from "react-hot-toast";

export default function AccountContent() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="bg-[#121212] p-6 rounded-xl space-y-8">
      <h2 className="text-xl font-semibold">Account Settings</h2>

      {/* Security Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield size={18} className="text-orange-500" />
          Security
        </h3>

        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Change Password</div>
            <div className="text-sm text-gray-400">
              Update your account password
            </div>
          </div>

          <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition cursor-pointer">
            Update
          </button>
        </div>
      </div>

      <div className="border-t border-neutral-800" />

      {/* About Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Info size={18} className="text-orange-500" />
          About
        </h3>

        <div className="text-sm text-gray-400">Planora v1.0.0</div>
      </div>

      <div className="border-t border-neutral-800" />

      {/* Danger Zone */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <UserLock size={18} className="text-orange-500" />
          Login Information
        </h3>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition cursor-pointer"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
