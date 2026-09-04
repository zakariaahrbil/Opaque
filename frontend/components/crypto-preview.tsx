"use client";

import { useState } from "react";
import { Lock, Unlock, Eye, EyeOff, ShieldCheck, Terminal, ArrowRightLeft } from "lucide-react";

export function CryptoPreview() {
  const [view, setView] = useState<"client" | "server">("client");
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-lg border border-border bg-card shadow-lg shadow-primary/5 overflow-hidden transition-all">
      {/* Terminal / Panel Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-border" />
            <span className="w-2.5 h-2.5 rounded-full bg-border" />
            <span className="w-2.5 h-2.5 rounded-full bg-border" />
          </div>
          <span className="text-xs font-mono text-muted-foreground m-1 sm:m-2 flex items-center gap-1.5">
            <Terminal className="size-3.5 text-primary" />
            vault_inspector.ts
          </span>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center bg-background/80 p-0.5 rounded-md border border-border">
          <button
            type="button"
            onClick={() => setView("client")}
            className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
              view === "client"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs shadow-primary/5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Client Memory
          </button>
          <button
            type="button"
            onClick={() => setView("server")}
            className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
              view === "server"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs shadow-primary/5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Server Wire Payload
          </button>
        </div>
      </div>

      {/* Panel Body */}
      <div className="p-5 font-mono text-xs space-y-4">
        {view === "client" ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2 text-primary font-medium">
                <Unlock className="size-3.5" />
                <span>LOCAL BROWSER RUNTIME</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] bg-primary/10 text-primary border border-primary/20">
                AES-256-GCM DECRYPTED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-muted-foreground">
              <span className="text-foreground/80 font-medium">Domain:</span>
              <span className="sm:col-span-2 text-foreground font-sans font-medium text-sm">
                github.com
              </span>

              <span className="text-foreground/80 font-medium">Identity:</span>
              <span className="sm:col-span-2 text-foreground">zalmoxis@opaque.vault</span>

              <span className="text-foreground/80 font-medium">Master Key:</span>
              <span className="sm:col-span-2 text-primary">
                PBKDF2-HMAC-SHA256 (600,000 iter) → In-Memory Only
              </span>

              <span className="text-foreground/80 font-medium">Password:</span>
              <div className="sm:col-span-2 flex items-center justify-between bg-background px-2.5 py-1.5 rounded border border-border">
                <span className="tracking-wider text-foreground">
                  {revealed ? "9x!Kq8#vLp2$mZ9A" : "••••••••••••••••"}
                </span>
                <button
                  type="button"
                  onClick={() => setRevealed(!revealed)}
                  className="text-muted-foreground hover:text-primary transition-colors ml-2"
                  title={revealed ? "Mask password" : "Reveal password"}
                >
                  {revealed ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground pt-1 flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-primary" />
              <span>Decryption takes place entirely in browser RAM using WebCrypto API.</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2 text-muted-foreground font-medium">
                <Lock className="size-3.5 text-warning" />
                <span>SERVER STORAGE & WIRE VIEW</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] bg-secondary text-muted-foreground border border-border">
                ZERO-KNOWLEDGE CIPHERTEXT
              </span>
            </div>

            <div className="bg-background/90 p-3 rounded border border-border space-y-1.5 text-[11.5px] overflow-x-auto text-muted-foreground">
              <p>
                <span className="text-foreground/70">&quot;iv&quot;:</span>{" "}
                <span className="text-primary">&quot;gY7aX1p9kLm0Zq8A&quot;</span>,
              </p>
              <p>
                <span className="text-foreground/70">&quot;ciphertext&quot;:</span>{" "}
                <span className="text-foreground/90">
                  &quot;e4b9d01a8f7c32890ae15b3c8471920da83c9284fa...&quot;
                </span>,
              </p>
              <p>
                <span className="text-foreground/70">&quot;tag&quot;:</span>{" "}
                <span className="text-warning">&quot;128-bit authentication tag&quot;</span>,
              </p>
              <p>
                <span className="text-foreground/70">&quot;server_access&quot;:</span>{" "}
                <span className="text-primary">&quot;0 bytes readable plaintext&quot;</span>
              </p>
            </div>

            <div className="text-[11px] text-muted-foreground pt-1 flex items-center gap-1.5">
              <ArrowRightLeft className="size-3.5 text-primary" />
              <span className="text-left">Even in case of a full database breach, ciphertext is cryptographically unreadable without your master password.</span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Bottom Bar */}
      <div className="px-4 py-2 bg-secondary/30 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Zero-Knowledge Status: Active
        </span>
        <button
          type="button"
          onClick={() => setView(view === "client" ? "server" : "client")}
          className="hover:text-primary transition-colors underline-offset-2 hover:underline cursor-pointer"
        >
          {view === "client" ? "Switch to wire payload →" : "← Switch to client memory"}
        </button>
      </div>
    </div>
  );
}
