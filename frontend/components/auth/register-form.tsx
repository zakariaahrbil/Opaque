"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { masterKeyGen, loginVerifierKeyGen } from "@/app/utils/crypt";

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Master password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("Please acknowledge the zero-knowledge disclaimer.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Deriving 256-bit master key (600,000 PBKDF2 rounds)...");

      const masterKey = await masterKeyGen({
        masterPassword: password,
        email: email.trim().toLowerCase(),
      });

      setStatus("Computing HKDF-SHA256 login verifier...");
      const loginVerifier = await loginVerifierKeyGen(masterKey);

      setStatus("Initializing vault on server...");

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
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
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 rounded border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-start gap-2">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <span>{error}</span>
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
          className="text-xs font-mono text-muted-foreground group-focus-within:text-primary transition-colors"
        >
          Enter your email *
        </label>
        <div className="border-b border-border/70 group-focus-within:border-primary transition-colors pb-1">
          <input
            id="reg-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            disabled={loading || success}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none font-sans py-1"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5 group">
        <div className="flex items-center justify-between">
          <label
            htmlFor="reg-password"
            className="text-xs font-mono text-muted-foreground group-focus-within:text-primary transition-colors"
          >
            Create master password *
          </label>
          <span className="text-[10px] font-mono text-muted-foreground/60">min 8 chars</span>
        </div>
        <div className="border-b border-border/70 group-focus-within:border-primary transition-colors pb-1 flex items-center gap-2">
          <input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••••••"
            disabled={loading || success}
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
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5 group">
        <label
          htmlFor="reg-confirm"
          className="text-xs font-mono text-muted-foreground group-focus-within:text-primary transition-colors"
        >
          Confirm master password *
        </label>
        <div className="border-b border-border/70 group-focus-within:border-primary transition-colors pb-1">
          <input
            id="reg-confirm"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••••••••••"
            disabled={loading || success}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none font-mono py-1 tracking-wider"
          />
        </div>
      </div>

      {/* Disclaimer checkbox */}
      <div className="flex items-start gap-3 pt-1">
        <input
          id="reg-terms"
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          disabled={loading || success}
          className="mt-0.5 size-3.5 cursor-pointer accent-[#2dd4a7]"
        />
        <label htmlFor="reg-terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer select-none">
          I understand that Opaque is zero-knowledge. If I lose my master password, my vault cannot be recovered by anyone.
        </label>
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
          disabled={loading || success}
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
