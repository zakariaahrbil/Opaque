"use client";

import Link from "next/link";
import { Lock, Unlock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/useAuthStore";

export function HeaderAuthButtons() {
  const status = useAuthStore((s) => s.status);
  const userEmail = useAuthStore((s) => s.userEmail);
  const masterKey = useAuthStore((s) => s.masterKey);
  const logout = useAuthStore((s) => s.logout);

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-16 rounded bg-secondary/50 animate-pulse" />
        <div className="h-8 w-24 rounded bg-secondary/50 animate-pulse" />
      </div>
    );
  }

  if (status === "authenticated") {
    const isUnlocked = masterKey !== null;

    return (
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Status Indicator */}
        <Link href="/vault" className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-secondary/70 hover:bg-secondary text-[11px] font-mono transition-colors">
          {isUnlocked ? (
            <>
              <Unlock className="size-3 text-primary" />
              <span className="text-foreground font-medium truncate max-w-[140px]">
                {userEmail || "Vault Unlocked"}
              </span>
            </>
          ) : (
            <>
              <Lock className="size-3 text-warning" />
              <span className="text-warning">Vault Locked</span>
            </>
          )}
        </Link>

        <Link href="/vault">
          <Button
            size="sm"
            className="font-mono text-xs font-semibold cursor-pointer leading-none px-3"
          >
            Vault
          </Button>
        </Link>

        {/* Sign Out Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => logout()}
          className="font-mono text-xs font-semibold cursor-pointer leading-none p-3 gap-1.5"
        >
          <LogOut className="size-3" />
          <span>Sign Out</span>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Link href="/login">
        <Button
          variant="outline"
          size="sm"
          className="font-mono text-xs font-semibold cursor-pointer leading-none p-4"
        >
          Sign In
        </Button>
      </Link>

      <Link href="/register">
        <Button
          size="sm"
          className="font-mono text-xs font-semibold cursor-pointer leading-none p-4"
        >
          Create Vault
        </Button>
      </Link>
    </>
  );
}
