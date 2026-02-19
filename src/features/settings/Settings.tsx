import { useState } from "react";
import { User, Sliders, Shield } from "lucide-react";
import SettingsCard from "./components/SettingsCard";
import SettingsModal from "./components/SettingsModal";
import ProfileContent from "./components/ProfileContent";
import PreferencesContent from "./components/PreferencesContent";
import AccountContent from "./components/AccountContent";

type Section = "profile" | "preferences" | "account" | null;

export default function Settings() {
  const [active, setActive] = useState<Section>(null);

  const renderContent = () => {
    switch (active) {
      case "profile":
        return <ProfileContent />;
      case "preferences":
        return <PreferencesContent />;
      case "account":
        return <AccountContent />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <SettingsCard
          icon={User}
          description="View and manage your profile information"
          title="Profile"
          onClick={() => setActive("profile")}
        />

        <SettingsCard
          icon={Sliders}
          description="Customize theme and application settings"
          title="Preferences"
          onClick={() => setActive("preferences")}
        />

        <SettingsCard
          icon={Shield}
          description="Manage account and security options"
          title="Account"
          onClick={() => setActive("account")}
        />
      </div>

      {active && (
        <SettingsModal onClose={() => setActive(null)}>
          {renderContent()}
        </SettingsModal>
      )}
    </div>
  );
}
