"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { masterKeyGen, loginVerifierKeyGen } from "@/app/utils/crypt";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const isBusy = loading || isSubmitting;

  async function onSubmit(data: LoginFormData) {
    setServerError(null);

    try {
      setLoading(true);
      setStatus("Deriving keys (600,000 PBKDF2 rounds)...");

      const masterKey = await masterKeyGen({
        masterPassword: data.password,
        email: data.email.trim().toLowerCase(),
      });

      setStatus("Computing HKDF-SHA256 login verifier...");
      const loginVerifier = await loginVerifierKeyGen(masterKey);

      setStatus("Verifying with vault server...");

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email.trim().toLowerCase(),
          password: loginVerifier,
        }),
      });

      if (!res.ok) {
        throw new Error(
          res.status === 401 || res.status === 403
            ? "Invalid email or master password."
            : (await res.text()) || "Login failed. Please verify your credentials."
        );
      }

      const resData = await res.json();
      if (resData.token) sessionStorage.setItem("opaque_jwt", resData.token);

      setStatus("Vault unlocked. Redirecting...");
      router.push("/");
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
      setStatus("");
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

      {/* Email */}
      <div className="space-y-1.5 group">
        <label
          htmlFor="email"
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
            id="email"
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
        <label
          htmlFor="password"
          className={cn(
            "text-xs font-mono transition-colors",
            errors.password
              ? "text-destructive"
              : "text-muted-foreground group-focus-within:text-primary"
          )}
        >
          Master password *
        </label>
        <div
          className={cn(
            "border-b pb-1 flex items-center gap-2 transition-colors",
            errors.password
              ? "border-destructive"
              : "border-border/70 group-focus-within:border-primary"
          )}
        >
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
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
          href="/register"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Create a vault
        </Link>

        <button
          type="submit"
          disabled={isBusy}
          className="group inline-flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary transition-colors disabled:opacity-50 cursor-pointer"
        >
          <span>{isBusy ? "Unlocking..." : "Unlock Vault"}</span>
          <span className="flex items-center justify-center size-8 rounded bg-foreground text-background group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
            {isBusy ? <Loader2 className="size-3.5 animate-spin" /> : <ArrowRight className="size-3.5" />}
          </span>
        </button>
      </div>
    </form>
  );
}
