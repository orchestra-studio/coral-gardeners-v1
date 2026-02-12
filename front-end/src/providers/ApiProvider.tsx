"use client";

import React, { useEffect } from "react";
import { LoadingProvider, useLoading } from "@/store/useLoading";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { setLoadingCallbacks } from "@/lib/api";

// Inner component that sets up the API callbacks
const ApiLoadingSetup: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { showLoading, hideLoading, isLoading } = useLoading();

  useEffect(() => {
    // Set up the callbacks for the API client
    setLoadingCallbacks({
      showLoading,
      hideLoading,
    });
  }, [showLoading, hideLoading]);

  return (
    <>
      {children}
      <LoadingOverlay isVisible={isLoading} />
    </>
  );
};

// Main provider that wraps everything
export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <LoadingProvider>
      <ApiLoadingSetup>{children}</ApiLoadingSetup>
    </LoadingProvider>
  );
};

export default ApiProvider;
