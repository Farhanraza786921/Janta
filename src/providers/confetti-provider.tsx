'use client';

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import Confetti from '@/components/confetti';

type ConfettiContextType = {
  onOpen: () => void;
};

const ConfettiContext = createContext<ConfettiContextType | null>(null);

export const useConfetti = () => {
  const context = useContext(ConfettiContext);
  if (!context) {
    throw new Error('useConfetti must be used within a ConfettiProvider');
  }
  return context;
};

export const ConfettiProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onComplete = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(() => ({ onOpen }), [onOpen]);

  return (
    <ConfettiContext.Provider value={value}>
      {children}
      {isOpen && <Confetti onComplete={onComplete} />}
    </ConfettiContext.Provider>
  );
};
