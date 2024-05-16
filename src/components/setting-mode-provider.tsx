import React, { createContext, useState, ReactNode, useContext } from "react";
import { type SettingModeContextType } from "@/lib/types";

const SettingModeContext = createContext<SettingModeContextType | undefined>(
  undefined
);

interface SettingModeProviderProps {
  children: ReactNode;
}

const SettingModeProvider: React.FC<SettingModeProviderProps> = ({
  children,
}) => {
  const [settingMode, setSettingMode] = useState<boolean>(false);

  return (
    <SettingModeContext.Provider value={{ settingMode, setSettingMode }}>
      {children}
    </SettingModeContext.Provider>
  );
};

const useSettingMode = (): SettingModeContextType => {
  const context = useContext(SettingModeContext);
  if (!context) {
    throw new Error(
      "useSettingMode must be used within an SettingModeProvider"
    );
  }
  return context;
};

export { SettingModeProvider, SettingModeContext, useSettingMode };
