"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { IconMail, IconLock, IconLogin } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InlineAlert } from "@/components/ui/inline-alert";
import { loginSchema, type LoginFormData } from "@/lib/auth/validationSchemas";
import { OAuthProviders } from "./components/OAuthProviders";
import { RememberMe } from "./components/RememberMe";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
}

export default function LoginForm({
  onSubmit,
  loading: externalLoading,
  error,
  onGoogleLogin,
  onAppleLogin,
}: LoginFormProps) {
  const t = useTranslations("auth.login");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  // Use internal loading state if external loading is not provided
  const loading = externalLoading ?? isSubmitting;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "admin@example.com",
      password: "Admin@123",
    },
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data.email, data.password);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInvalidSubmit = () => {
    const firstErrorField = Object.keys(errors)[0];
    const firstError = errors[firstErrorField as keyof typeof errors];

    if (firstError?.message) {
      toast.error(firstError.message);
    }
  };

  const handleGoogleLogin = () => {
    if (onGoogleLogin) {
      onGoogleLogin();
    } else {
      toast.info(t("googleNotConfigured"));
    }
  };

  const handleAppleLogin = () => {
    if (onAppleLogin) {
      onAppleLogin();
    } else {
      toast.info(t("appleNotConfigured"));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit(handleFormSubmit, handleInvalidSubmit)}
        className="flex flex-col gap-4"
      >
        {/* Error Message */}
        {error && <InlineAlert variant="error" message={error} />}

        {/* Email Field */}
        <Input
          type="email"
          label={t("emailLabel")}
          placeholder={t("emailPlaceholder")}
          startIcon={<IconMail className="h-5 w-5" />}
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Password Field */}
        <Input
          type="password"
          label={t("passwordLabel")}
          placeholder={t("passwordPlaceholder")}
          startIcon={<IconLock className="h-5 w-5" />}
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Remember Me & Forgot Password */}
        <RememberMe
          checked={rememberMe}
          onChange={setRememberMe}
          rememberMeText={t("rememberMe")}
          forgotPasswordText={t("forgotPassword")}
          forgotPasswordHref="/auth/forgot-password"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || !isValid}
          variant="default"
          size="default"
          className="w-full"
          loading={loading}
          loadingText={t("loadingText")}
          startIcon={<IconLogin className="h-5 w-5" />}
        >
          {t("submitButton")}
        </Button>
      </form>

      {/* OAuth Providers */}
      <OAuthProviders
        onGoogleLogin={handleGoogleLogin}
        onAppleLogin={handleAppleLogin}
        disabled={loading}
      />
    </div>
  );
}
