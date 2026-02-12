"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface LoadingContextType {
  isLoading: boolean;
  activeRequests: number;
  showLoading: () => void;
  hideLoading: () => void;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeRequests, setActiveRequests] = useState(0);

  const showLoading = () => {
    setActiveRequests((prev) => {
      const newCount = prev + 1;
      setIsLoading(true);
      return newCount;
    });
  };

  const hideLoading = () => {
    setActiveRequests((prev) => {
      const newCount = Math.max(0, prev - 1);
      setIsLoading(newCount > 0);
      return newCount;
    });
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
    setActiveRequests(loading ? 1 : 0);
  };

  const value = {
    isLoading,
    activeRequests,
    showLoading,
    hideLoading,
    setLoading,
  };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
