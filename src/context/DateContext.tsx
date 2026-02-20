import { createContext, useContext, useState, type ReactNode } from "react";

interface DateContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

const todayISO = () => new Date().toISOString().split("T")[0];

export const DateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDate, setSelectedDate] = useState<string>(todayISO());

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDate must be used within DateProvider");
  }
  return context;
};
