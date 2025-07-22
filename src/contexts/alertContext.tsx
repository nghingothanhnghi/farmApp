import React, { createContext, useContext, useState} from 'react';
import type { ReactNode } from 'react';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface Alert {
  message: string;
  type: AlertType;
}

interface AlertContextType {
  alert: Alert | null;
  setAlert: (alert: Alert | null) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<Alert | null>(null);

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
