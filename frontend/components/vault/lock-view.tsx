"use client";

import { useState, type FormEvent } from "react";
import {
    Lock,
    Unlock,
    Eye,
    EyeOff,
    LogOut,
    ShieldCheck,
    KeyRound,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { masterKeyGen, unlockingVerifierKeyGen } from "@/app/utils/crypt";


export function LockView() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const {userEmail, unlockVault, logout, isUnlockVerifierMatched, unlockVerifier } = useAuthStore();
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleUnlock(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        if (!password || !userEmail) return;

        setSubmitting(true);
        try {
            const masterKey = await masterKeyGen({
                masterPassword: password,
                email: userEmail.trim().toLowerCase(),
            });
            const unlockVerifierGenerated = await unlockingVerifierKeyGen(masterKey);
            if (!isUnlockVerifierMatched(unlockVerifierGenerated)) {
                setError("Invalid password");
                setSubmitting(false);
                return;
            }
            unlockVault(masterKey);
        } catch (e) {
            setError("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="flex-1 w-full flex flex-col items-center justify-center p-4 relative overflow-hidden select-none bg-background">
            <div className="w-full max-w-md relative z-10 space-y-6">
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="relative flex items-center justify-center size-16 rounded-2xl bg-card border border-border/80 shadow-xl">
                        <div className="absolute -inset-1 rounded-2xl bg-primary/10 blur-md -z-10" />
                        <Lock className="size-7 text-primary stroke-[2]" />
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            Vault is Locked
                        </h1>
                        <p className="text-xs text-muted-foreground max-w-xs">
                            Your master key has been cleared from memory. Enter your master password to decrypt your credentials.
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/60 border border-border text-xs font-mono text-foreground/80">
                        <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="truncate max-w-[220px]">{userEmail}</span>
                    </div>
                </div>

                <div className="p-6 rounded-lg border border-border bg-card/80 space-y-4">
                    <form onSubmit={handleUnlock} className="space-y-4">
                        <div className="space-y-1.5">
                            <label
                                htmlFor="master-password"
                                className="text-xs font-mono text-muted-foreground flex items-center justify-between"
                            >
                                <span>Master Password</span>
                                <span className="text-[10px] text-muted-foreground/60">Never leaves your device</span>
                            </label>

                            <div className="relative flex items-center">
                                <input
                                    id="master-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your master password"
                                    autoComplete="current-password"
                                    className="w-full pl-3 pr-10 py-2 rounded-lg bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary transition-colors font-mono tracking-wider"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2.5 text-muted-foreground hover:text-foreground transition-colors p-1"
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-3.5" />
                                    ) : (
                                        <Eye className="size-3.5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-2.5 rounded-md border border-destructive/30 bg-destructive/10 text-destructive text-xs font-mono">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={submitting || password.length < 8}
                            className="w-full h-9 font-mono text-xs cursor-pointer flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="size-3.5 animate-spin" />
                                    <span>Unlocking...</span>
                                </>
                            ) : (
                                <>
                                    <Unlock className="size-3.5" />
                                    <span>Unlock Vault</span>
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                        <button
                            type="button"
                            onClick={() => {
                                logout()
                            }}
                            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors font-mono cursor-pointer"
                        >
                            <LogOut className="size-3" />
                            <span>Log out / Switch account</span>
                        </button>

                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground/70">
                            <KeyRound className="size-3" />
                            <span>ZKP & Zero-Knowledge</span>
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-muted-foreground/60 text-center">
                    <ShieldCheck className="size-3.5 text-emerald-500 shrink-0" />
                    <span>Client-side AES-256-GCM • Zero plain text storage</span>
                </div>
            </div>
        </div>
    );
}