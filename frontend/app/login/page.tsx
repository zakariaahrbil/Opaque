import { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign-In | Opaque Vault",
  description: "Sign in to decrypt and unlock your zero-knowledge Opaque vault.",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Sign-In"
      subtitle="Enter your email and master password to decrypt your zero-knowledge vault."
      brandTagline="Welcome to Opaque — your exclusive hub for zero-knowledge security"
    >
      <LoginForm />
    </AuthCard>
  );
}
