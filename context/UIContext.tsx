import React, { createContext, useContext, useState, ReactNode } from 'react';

type CursorVariant = 'default' | 'hover' | 'text' | 'image' | 'hidden';

interface UIContextType {
  isConnectOpen: boolean;
  openConnect: () => void;
  closeConnect: () => void;
  cursorVariant: CursorVariant;
  setCursorVariant: (variant: CursorVariant) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>('default');

  const openConnect = () => setIsConnectOpen(true);
  const closeConnect = () => setIsConnectOpen(false);

  return (
    <UIContext.Provider value={{ 
      isConnectOpen, 
      openConnect, 
      closeConnect, 
      cursorVariant, 
      setCursorVariant 
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
};
