import type { Preferences } from "./settings.types";

const PREF_KEY = "planora_preferences";

export const settingsService = {
  getPreferences(): Preferences {
    const stored = localStorage.getItem(PREF_KEY);
    return stored ? JSON.parse(stored) : { theme: "dark" };
  },

  savePreferences(prefs: Preferences) {
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
  },
};
