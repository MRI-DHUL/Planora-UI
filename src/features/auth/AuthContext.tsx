import { createContext, useContext, useState, useEffect } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("planora_user");
    if (storedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string) => {
    const storedUsers = JSON.parse(
      localStorage.getItem("planora_users") || "[]",
    );

    const foundUser = storedUsers.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (u: any) => u.email === email && u.password === password,
    );

    if (foundUser) {
      localStorage.setItem("planora_user", JSON.stringify(foundUser));
      setUser(foundUser);
      return true;
    }

    return false;
  };

  const register = (name: string, email: string, password: string) => {
    const storedUsers = JSON.parse(
      localStorage.getItem("planora_users") || "[]",
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userExists = storedUsers.find((u: any) => u.email === email);

    if (userExists) return false;

    const newUser = { name, email, password };

    localStorage.setItem(
      "planora_users",
      JSON.stringify([...storedUsers, newUser]),
    );

    localStorage.setItem("planora_user", JSON.stringify(newUser));
    setUser(newUser);

    return true;
  };

  const logout = () => {
    localStorage.removeItem("planora_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
