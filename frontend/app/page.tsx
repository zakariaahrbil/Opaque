import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lock, DiameterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CryptoPreview } from "@/components/crypto-preview";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[100px] opacity-90" />
      </div>

      {/* Header */}
      <header className="fixed z-10 w-full border-b border-border/80 bg-background/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <Image
                src="/logo/logo-horizental.svg"
                alt="Opaque"
                width={130}
                height={51}
                priority
                className="h-7 w-auto"
              />
            </Link>
            <span className="hidden sm:inline-block font-mono text-[11px] px-2 py-0.5 rounded border border-border bg-secondary text-muted-foreground">
              v0.1.0-alpha
            </span>
          </div>

          <nav className="flex items-center gap-3 sm:gap-5">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <DiameterIcon className="size-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </Link>

            <Link href="/login">
              <Button variant="outline" size="sm" className="font-mono text-xs cursor-pointer">
                Sign In
              </Button>
            </Link>

            <Link href="/register">
              <Button size="sm" className="font-mono text-xs font-semibold cursor-pointer">
                Create Vault
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-0 flex-1 flex flex-col items-center justify-center px-6 py-24 md:py-36">
        <div className="w-full max-w-3xl mx-auto text-center space-y-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/60 text-xs font-mono text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-foreground font-medium">Zero-Knowledge</span>
            <span className="text-border/80 select-none">|</span>
            <span>Client-Side Encrypted</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-[3.5rem] font-semibold tracking-tight leading-[1.12] text-foreground font-heading">
            Privacy by design.
            <span className="block font-normal text-muted-foreground mt-1.5">
              Security by mathematics.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed">
            Opaque encrypts and decrypts credentials exclusively in your browser using AES-256-GCM.
            Decrypted secrets and master keys never touch the server.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="h-10 px-5 font-medium cursor-pointer gap-2">
                Open Your Vault
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-10 px-5 font-mono text-xs cursor-pointer gap-2">
                <Lock className="size-3.5 text-primary" />
                Unlock Existing
              </Button>
            </Link>
          </div>

          {/* Interactive Crypto Inspector */}
          <div className="pt-4 ">
            <CryptoPreview />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-border/60 py-5 px-6 bg-background/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Opaque Cryptographic Vault</span>
          </div>
          <span>Zero plaintexts transmitted · Client-side WebCrypto</span>
        </div>
      </footer>
    </div>
  );
}