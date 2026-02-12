import React from "react";

interface GreetingHeaderProps {
  greeting: string;
  userName: string;
  subtitle: string;
}

/**
 * GreetingHeader - Shows personalized greeting message
 */
export function GreetingHeader({
  greeting,
  userName,
  subtitle,
}: GreetingHeaderProps) {
  // Extract first name from full name
  const firstName = userName.split(" ")[0];

  return (
    <div className="w-full ">
      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
        {greeting}, {firstName}
      </h2>
      <p className="text-sm text-[var(--text-muted)] mt-1">{subtitle}</p>
    </div>
  );
}
