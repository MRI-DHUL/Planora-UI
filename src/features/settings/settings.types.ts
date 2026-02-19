export interface UserProfile {
  name: string;
  email: string;
}

export interface Preferences {
  theme: "dark" | "light";
  notifications?: boolean;
}