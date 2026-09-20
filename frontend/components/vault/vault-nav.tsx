import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Lock, Plus } from "lucide-react";



export function VaultNav() {
    return (
        <header className="sm:px-6 px-4 h-14 flex items-center justify-between gap-4 bg-card backdrop-blur-md border-b border-border sticky top-0 z-20">
            <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo/logo-horizental.svg"
                        alt="Opaque"
                        width={110}
                        height={38}
                        className="h-6 w-auto"
                    />
                </Link>
                <span className="text-border font-mono sm:block hidden">/</span>
                <span className="text-xs font-mono font-medium text-muted-foreground sm:block hidden">Coffre Principal</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-secondary/50 overflow-hidden border-border px-2.5 py-1.5 rounded-md border">
                    <div className=" text-xs font-mono flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-foreground">Unlocked (ZKP)</span>
                    </div>
                </div>
                <Button
                    size="sm"
                    className="font-mono text-xs cursor-pointer flex items-center gap-1.5"
                >
                    <Plus className="size-3.5" />
                    <span className="sm:block hidden">New Item</span>
                </Button>
                <Link href="/">
                    <Button
                        variant="outline"
                        size="sm"
                        className="font-mono text-xs cursor-pointer flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                        <Lock className="size-3" />
                        <span className="hidden sm:inline">Lock</span>
                    </Button>
                </Link>
            </div>

        </header>
    );
}