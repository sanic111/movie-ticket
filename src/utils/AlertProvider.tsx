import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import AlertBox from "@/components/AlertBox";

interface AlertContextType {
  showAlert: (message: string) => void;
}

const AlertContext = createContext<AlertContextType>({ showAlert: () => {} });

export const useAlert = () => useContext(AlertContext);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<{ id: number; message: string }[]>([]);
  const idRef = useRef(0);

  const showAlert = useCallback((message: string) => {
    setQueue((q) => {
      if (q.length > 0 && q[0].message === message) return q;
      if (q.some(alert => alert.message === message)) return q;
      return [...q, { id: ++idRef.current, message }];
    });
  }, []);

  const handleClose = useCallback(() => {
    setQueue((q) => q.slice(1));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {queue.length > 0 && (
        <AlertBox
          key={queue[0].id}
          message={queue[0].message}
          onClose={handleClose}
        />
      )}
    </AlertContext.Provider>
  );
};
