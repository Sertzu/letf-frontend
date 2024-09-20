import { createContext, useContext, useState, ReactNode } from 'react';

// Create the context
const SwitchContext = createContext<{
  isFunEnabled: boolean;
  toggleFun: () => void;
} | undefined>(undefined);

// Context provider
export function SwitchProvider({ children }: { children: ReactNode }) {
  const [isFunEnabled, setIsFunEnabled] = useState(false);

  const toggleFun = () => {
    setIsFunEnabled((prev) => {
      //console.log("Toggling isFunEnabled:", !prev); // Debug log
      return !prev;
    });
  };
  return (
    <SwitchContext.Provider value={{ isFunEnabled, toggleFun }}>
      {children}
    </SwitchContext.Provider>
  );
}

// Hook to use the switch state
export function useFunSwitch() {
  const context = useContext(SwitchContext);
  if (!context) {
    throw new Error('useFunSwitch must be used within a SwitchProvider');
  }
  return context;
}