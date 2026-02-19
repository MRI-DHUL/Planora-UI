import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import toast from "react-hot-toast";
import { User } from "lucide-react";

export default function ProfileContent() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    const updatedUser = {
      ...user,
      name,
    };

    localStorage.setItem("planora_user", JSON.stringify(updatedUser));
    toast.success("Profile updated");
    setIsEditing(false);
  };

  return (
    <div className="bg-[#121212] p-6 rounded-xl space-y-6">
      <h2 className="text-xl font-semibold">Profile</h2>

      {/* Avatar Section */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center">
          <User size={28} className="text-gray-400" />
        </div>

        <div>
          <div className="font-medium">{user?.email}</div>
          <div className="text-sm text-gray-400">User Account</div>
        </div>
      </div>

      <div className="border-t border-neutral-800" />

      {/* Editable Info */}
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400">Full Name</label>

          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-orange-500"
            />
          ) : (
            <div className="mt-1 font-medium">{name}</div>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-400">Email</label>
          <div className="mt-1 font-medium text-gray-300">
            {user?.email}
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800" />

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-orange-600 rounded-lg hover:bg-orange-700 transition cursor-pointer"
            >
              Save Changes
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-orange-600 rounded-lg hover:bg-orange-700 transition cursor-pointer"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
