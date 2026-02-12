"use client";

import { useEffect } from "react";
import { useAppNavigation } from "../../hooks/navigation/useAppNavigation";

export default function Home() {
  const { navigateTo } = useAppNavigation();

  useEffect(() => {
    // Navigate to dashboard on client side
    navigateTo("/dashboard");
  }, [navigateTo]);

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
