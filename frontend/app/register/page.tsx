import { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Vault | Opaque",
  description: "Create a new zero-knowledge encrypted vault with client-side cryptography.",
};

import { GuestGuard } from "@/components/auth/auth-guard";

export default function RegisterPage() {
  return (
    <GuestGuard>
      <AuthCard
        title="Create Vault"
        subtitle="Enter your details to generate your master key and initialize your zero-knowledge vault."
        brandTagline="Welcome to Opaque — security by mathematics, privacy by design"
      >
        <RegisterForm />
      </AuthCard>
    </GuestGuard>
  );
}
