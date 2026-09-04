import Image from "next/image";
import Link from "next/link";
import { PixelMosaic } from "./pixel-mosaic";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  brandTagline?: string;
}

export function AuthCard({
  title,
  subtitle,
  children,
  brandTagline = "Welcome to Opaque — your zero-knowledge cryptographic vault",
}: AuthCardProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-background text-foreground ">
      {/* Card Frame */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 rounded-xl border border-border bg-card overflow-hidden shadow-2xl shadow-primary/5">
        {/* Left: Mosaic + Brand */}
        <div className="relative md:col-span-7 flex flex-col justify-between p-8 sm:p-10 overflow-hidden min-h-[280px] md:min-h-[600px] border-b md:border-b-0 md:border-r border-border/60">
          <PixelMosaic />

          {/* Logo */}
          <div className="relative z-10">
            <Link
              href="/"
              className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded transition-opacity hover:opacity-80"
            >
              <Image
                src="/logo/logo-horizental.svg"
                alt="Opaque"
                width={120}
                height={47}
                priority
                className="h-7 w-auto"
              />
            </Link>
          </div>

          {/* Tagline */}
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-[2rem] font-normal leading-[1.25] text-foreground tracking-tight font-heading max-w-sm">
              {brandTagline}
            </h2>
            <p className="mt-3 text-[11px] font-mono text-muted-foreground/70">
              WebCrypto Native · Zero-Plaintext Transmission
            </p>
          </div>
        </div>

        {/* Right: Form Panel */}
        <div className="md:col-span-5 flex flex-col justify-between p-8 sm:p-10 bg-card">
          <div className="space-y-7">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-[1.6rem] font-semibold tracking-tight text-foreground font-heading">
                {title}
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            </div>

            {children}
          </div>

          {/* Panel Footer */}
          <div className="pt-8 mt-6 border-t border-border/30 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>AES-256-GCM · PBKDF2</span>
            <Link href="/" className="hover:text-foreground transition-colors">
              ← Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
