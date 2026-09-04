"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { masterKeyGen, loginVerifierKeyGen } from "@/app/utils/crypt";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      setStatus("Deriving keys (600,000 PBKDF2 rounds)...");

      const masterKey = await masterKeyGen({
        masterPassword: password,
        email: email.trim().toLowerCase(),
      });

      setStatus("Computing HKDF-SHA256 login verifier...");
      const loginVerifier = await loginVerifierKeyGen(masterKey);

      setStatus("Verifying with vault server...");

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
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

      const data = await res.json();
      if (data.token) sessionStorage.setItem("opaque_jwt", data.token);

      setStatus("Vault unlocked. Redirecting...");
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
      setStatus("");
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

      {/* Email */}
      <div className="space-y-1.5 group">
        <label
          htmlFor="email"
          className="text-xs font-mono text-muted-foreground group-focus-within:text-primary transition-colors"
        >
          Enter your email *
        </label>
        <div className="border-b border-border/70 group-focus-within:border-primary transition-colors pb-1">
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            disabled={loading}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none font-sans py-1"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5 group">
        <label
          htmlFor="password"
          className="text-xs font-mono text-muted-foreground group-focus-within:text-primary transition-colors"
        >
          Master password *
        </label>
        <div className="border-b border-border/70 group-focus-within:border-primary transition-colors pb-1 flex items-center gap-2">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••••••"
            disabled={loading}
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
          disabled={loading}
          className="group inline-flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary transition-colors disabled:opacity-50 cursor-pointer"
        >
          <span>{loading ? "Unlocking..." : "Unlock Vault"}</span>
          <span className="flex items-center justify-center size-8 rounded bg-foreground text-background group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
            {loading ? <Loader2 className="size-3.5 animate-spin" /> : <ArrowRight className="size-3.5" />}
          </span>
        </button>
      </div>
    </form>
  );
}
