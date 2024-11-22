"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface SpinnerContextProps {
  loading: boolean;
  showSpinner: () => void;
  hideSpinner: () => void;
}

const SpinnerContext = createContext<SpinnerContextProps>({
  loading: false,
  showSpinner: () => {},
  hideSpinner: () => {},
});

export const SpinnerProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const showSpinner = () => setLoading(true);
  const hideSpinner = () => setLoading(false);

  return (
    <SpinnerContext.Provider value={{ loading, showSpinner, hideSpinner }}>
      {children}
    </SpinnerContext.Provider>
  );
};

export const useSpinner = () => useContext(SpinnerContext);
