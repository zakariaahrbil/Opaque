"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { masterKeyGen, loginVerifierKeyGen } from "@/app/utils/crypt";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      agreed: false,
    },
    mode: "onTouched",
  });

  const isBusy = loading || isSubmitting || success;

  async function onSubmit(data: RegisterFormData) {
    setServerError(null);

    try {
      setLoading(true);
      setStatus("Deriving 256-bit master key (600,000 PBKDF2 rounds)...");

      const masterKey = await masterKeyGen({
        masterPassword: data.password,
        email: data.email.trim().toLowerCase(),
      });

      setStatus("Computing HKDF-SHA256 login verifier...");
      const loginVerifier = await loginVerifierKeyGen(masterKey);

      setStatus("Initializing vault on server...");

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email.trim().toLowerCase(),
          password: loginVerifier,
        }),
      });

      if (!res.ok) {
        throw new Error(
          (await res.text()) || "Registration failed. An account with this email may already exist."
        );
      }

      setSuccess(true);
      setStatus("Vault initialized. Redirecting to sign in...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && (
        <div className="p-3 rounded border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-start gap-2">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {success && (
        <div className="p-3 rounded border border-primary/30 bg-primary/10 text-primary text-xs flex items-start gap-2">
          <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
          <span>Vault created! Redirecting...</span>
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5 group">
        <label
          htmlFor="reg-email"
          className={cn(
            "text-xs font-mono transition-colors",
            errors.email
              ? "text-destructive"
              : "text-muted-foreground group-focus-within:text-primary"
          )}
        >
          Enter your email *
        </label>
        <div
          className={cn(
            "border-b pb-1 transition-colors",
            errors.email
              ? "border-destructive"
              : "border-border/70 group-focus-within:border-primary"
          )}
        >
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            placeholder="user@example.com"
            disabled={isBusy}
            {...register("email")}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none font-sans py-1"
          />
        </div>
        {errors.email && (
          <p className="text-[11px] font-mono text-destructive pt-0.5">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5 group">
        <div className="flex items-center justify-between">
          <label
            htmlFor="reg-password"
            className={cn(
              "text-xs font-mono transition-colors",
              errors.password
                ? "text-destructive"
                : "text-muted-foreground group-focus-within:text-primary"
            )}
          >
            Create master password *
          </label>
          <span className="text-[10px] font-mono text-muted-foreground/60">min 8 chars</span>
        </div>
        <div
          className={cn(
            "border-b pb-1 flex items-center gap-2 transition-colors",
            errors.password
              ? "border-destructive"
              : "border-border/70 group-focus-within:border-primary"
          )}
        >
          <input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••••••••••"
            disabled={isBusy}
            {...register("password")}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none font-mono py-1 tracking-wider"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title={showPassword ? "Hide password" : "Reveal password"}
          >
            {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-[11px] font-mono text-destructive pt-0.5">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5 group">
        <label
          htmlFor="reg-confirm"
          className={cn(
            "text-xs font-mono transition-colors",
            errors.confirmPassword
              ? "text-destructive"
              : "text-muted-foreground group-focus-within:text-primary"
          )}
        >
          Confirm master password *
        </label>
        <div
          className={cn(
            "border-b pb-1 transition-colors",
            errors.confirmPassword
              ? "border-destructive"
              : "border-border/70 group-focus-within:border-primary"
          )}
        >
          <input
            id="reg-confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••••••••••"
            disabled={isBusy}
            {...register("confirmPassword")}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none font-mono py-1 tracking-wider"
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-[11px] font-mono text-destructive pt-0.5">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Disclaimer checkbox */}
      <div className="space-y-1 pt-1">
        <div className="flex items-start gap-3">
          <input
            id="reg-terms"
            type="checkbox"
            disabled={isBusy}
            {...register("agreed")}
            className="mt-0.5 size-3.5 cursor-pointer accent-primary"
          />
          <label htmlFor="reg-terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer select-none">
            I understand that Opaque is zero-knowledge. If I lose my master password, my vault cannot be recovered by anyone.
          </label>
        </div>
        {errors.agreed && (
          <p className="text-[11px] font-mono text-destructive pl-6.5">
            {errors.agreed.message}
          </p>
        )}
      </div>

      {/* Crypto status */}
      {status && (
        <div className="text-[11px] font-mono text-primary flex items-center gap-1.5">
          <Loader2 className="size-3 animate-spin shrink-0" />
          <span>{status}</span>
        </div>
      )}

      {/* Footer row */}
      <div className="pt-2 flex items-center justify-between gap-4">
        <Link
          href="/login"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Already have a vault?
        </Link>

        <button
          type="submit"
          disabled={isBusy}
          className="group inline-flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary transition-colors disabled:opacity-50 cursor-pointer"
        >
          <span>{loading ? "Generating..." : "Create Vault"}</span>
          <span className="flex items-center justify-center size-8 rounded bg-foreground text-background group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
            {loading ? <Loader2 className="size-3.5 animate-spin" /> : <ArrowRight className="size-3.5" />}
          </span>
        </button>
      </div>
    </form>
  );
}
