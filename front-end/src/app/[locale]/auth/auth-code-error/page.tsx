"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { IconArrowLeft, IconMail } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import AuthLayout from "@/layouts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

export default function AuthCodeErrorPage() {
  const t = useTranslations("auth.authCodeError");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);

  // Get simple error message
  const getErrorMessage = () => {
    if (errorCode === "otp_expired" || error === "access_denied") {
      return "Your verification link has expired. Please request a new one.";
    }
    return "We couldn't verify your email. Please try again.";
  };

  // Handle showing email input
  const handleShowEmailInput = () => {
    setShowEmailInput(true);
  };

  // Handle resend verification
  const handleResendVerification = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsResending(true);

    try {
      // Get current locale from pathname
      const pathname = window.location.pathname;
      const localeMatch = pathname.match(/^\/([a-z]{2})\//);
      const currentLocale = localeMatch ? localeMatch[1] : "en";

      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          locale: currentLocale,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Verification email sent! Please check your inbox.");
        setEmail(""); // Clear the email input
        setShowEmailInput(false); // Hide the input after success
      } else {
        toast.error(data.error || "Failed to send verification email");
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      toast.error("Failed to send verification email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };
  return (
    <AuthLayout title={t("title")} subtitle={t("description")}>
      <div className="w-full flex flex-col text-center" style={{ gap: "2rem" }}>
        <div className="text-center">
          <h2
            className="text-3xl font-bold"
            style={{
              marginBlockStart: "1.5rem",
              color: "var(--text)",
            }}
          >
            {t("title")}
          </h2>

          <p
            className="text-sm"
            style={{
              marginBlockStart: "0.5rem",
              color: "var(--text-muted)",
            }}
          >
            {getErrorMessage()}
          </p>
        </div>

        <div className="flex flex-col" style={{ gap: "1.5rem" }}>
          {/* Conditional email input for resending verification */}
          {showEmailInput ? (
            <div className="flex flex-col" style={{ gap: "0.75rem" }}>
              <Input
                type="email"
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to resend verification"
                startIcon={<IconMail className="h-4 w-4" />}
                disabled={isResending}
              />

              <div className="flex flex-col" style={{ gap: "0.5rem" }}>
                <Button
                  onClick={handleResendVerification}
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={isResending || !email.trim()}
                >
                  {isResending ? "Sending..." : "Send Verification Email"}
                </Button>

                <Button
                  onClick={() => setShowEmailInput(false)}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleShowEmailInput}
              variant="outline"
              size="lg"
              className="w-full"
            >
              {t("tryAgain")}
            </Button>
          )}

          <div className="flex flex-col" style={{ gap: "0.75rem" }}>
            <Button
              href="/auth/login"
              variant="default"
              size="lg"
              className="w-full"
            >
              {t("backToLogin")}
            </Button>

            <Button
              href="/"
              variant="ghost"
              size="default"
              startIcon={<IconArrowLeft className="h-4 w-4" />}
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
