"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/store/useAuth";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import type { AuthError } from "@/lib/auth/types";
import { handleUnexpectedError } from "@/lib/auth/errors";
import { toast } from "react-toastify";
import AuthLayout from "@/layouts/auth";
import LoginForm from "@/features/auth/LoginForm";

export default function LoginPage() {
  const tSuccess = useTranslations("auth.success");
  const tLayout = useTranslations("auth.layout");
  const { signIn, actionLoading } = useAuth();
  const { navigateAfterAuth } = useAppNavigation();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await signIn(email, password);

      if (result.error) {
        const error = result.error as AuthError;
        // Display the error message directly from backend instead of using handleLoginError
        toast.error(error.message || "Login failed");
      } else {
        toast.success(tSuccess("loginSuccess"));
        // Use navigateAfterAuth for a clean post-authentication redirect
        setTimeout(() => {
          navigateAfterAuth("/dashboard");
        }, 150);
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      handleUnexpectedError(err);
    }
  };

  return (
    <AuthLayout
      title={tLayout("welcomeTitle")}
      subtitle={tLayout("welcomeSubtitle")}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <LoginForm onSubmit={handleLogin} loading={actionLoading} />
      </div>
    </AuthLayout>
  );
}
