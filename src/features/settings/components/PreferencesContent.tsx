import { useEffect, useState } from "react";
import { settingsService } from "../settings.service";
import type { Preferences } from "../settings.types";
import { Moon, Sun, Bell, Monitor } from "lucide-react";
import ToggleSwitch from "../../../components/ui/ToggleSwitch";
import toast from "react-hot-toast";

export default function PreferencesContent() {
  const [prefs, setPrefs] = useState<Preferences>(
    settingsService.getPreferences()
  );

  // Save only when prefs change
  useEffect(() => {
    settingsService.savePreferences(prefs);
  }, [prefs]);

  const updatePreference = <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: value,
    }));

    toast.success("Preference updated");
  };

  return (
    <div className="bg-[#121212] p-6 rounded-xl space-y-8">
      <h2 className="text-xl font-semibold">Preferences</h2>

      {/* Appearance Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Monitor size={18} className="text-orange-500" />
          Appearance
        </h3>

        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Theme</div>
            <div className="text-sm text-gray-400">
              Choose your application theme
            </div>
          </div>

          <div className="flex items-center gap-3">
            {prefs.theme === "dark" ? (
              <Moon size={18} className="text-orange-500" />
            ) : (
              <Sun size={18} className="text-yellow-400" />
            )}

            <ToggleSwitch
              checked={prefs.theme === "dark"}
              onChange={(val) =>
                updatePreference("theme", val ? "dark" : "light")
              }
            />
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800" />

      {/* Notifications Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bell size={18} className="text-orange-500" />
          Notifications
        </h3>

        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Task Reminders</div>
            <div className="text-sm text-gray-400">
              Enable reminder notifications
            </div>
          </div>

          <ToggleSwitch
            checked={prefs.notifications ?? true}
            onChange={(val) =>
              updatePreference("notifications", val)
            }
          />
        </div>
      </div>
    </div>
  );
}
