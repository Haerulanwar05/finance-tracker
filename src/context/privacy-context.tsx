"use client";

import * as React from "react";

interface PrivacyContextType {
  isPrivate: boolean;
  togglePrivacy: () => void;
  formatPrivateAmount: (formattedAmount: string) => string;
}

const PrivacyContext = React.createContext<PrivacyContextType>({
  isPrivate: false,
  togglePrivacy: () => {},
  formatPrivateAmount: (amt) => amt,
});

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("ft-privacy-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("ft-privacy-change", callback);
  };
}

function getSnapshot(): boolean {
  try {
    return localStorage.getItem("ft_privacy_mode") === "true";
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
  const isPrivate = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const togglePrivacy = React.useCallback(() => {
    try {
      const current = localStorage.getItem("ft_privacy_mode") === "true";
      localStorage.setItem("ft_privacy_mode", String(!current));
      window.dispatchEvent(new Event("ft-privacy-change"));
    } catch {
      // Ignore
    }
  }, []);

  const formatPrivateAmount = React.useCallback(
    (formattedAmount: string) => {
      if (!isPrivate) return formattedAmount;
      return "Rp ••••••••";
    },
    [isPrivate]
  );

  return (
    <PrivacyContext.Provider value={{ isPrivate, togglePrivacy, formatPrivateAmount }}>
      {children}
    </PrivacyContext.Provider>
  );
}

export function usePrivacy() {
  const context = React.useContext(PrivacyContext);
  if (!context) {
    throw new Error("usePrivacy must be used within a PrivacyProvider");
  }
  return context;
}
