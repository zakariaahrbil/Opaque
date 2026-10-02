'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    AlertCircle,
    Check,
    Copy,
    Edit3,
    ExternalLink,
    Eye,
    EyeOff,
    Globe,
    Loader2,
    Lock,
    Shield,
    Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "../ui/button";
import { useGetVaultItems} from "@/lib/hooks/useVaultItems";
import { decryptCreds, Creds } from "@/app/utils/crypt";
import { useAuthStore } from "@/lib/store/useAuthStore";

export function VaultRight() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const id = params.get("itemId");

    const masterKey = useAuthStore((s) => s.masterKey);
    const { data, isLoading } = useGetVaultItems();

    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [decryptedCreds, setDecryptedCreds] = useState<Creds | null>(null);
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [decryptError, setDecryptError] = useState<string | null>(null);

    const vaultItem = useMemo(
        () => data?.find((item) => item.id === id) ?? null,
        [data, id]
    );

    useEffect(() => {
        let isCancelled = false;

        setShowPassword(false);
        setDecryptError(null);

        if (!vaultItem) {
            setDecryptedCreds(null);
            setIsDecrypting(false);
            return;
        }

        if (!masterKey) {
            setDecryptedCreds(null);
            setIsDecrypting(false);
            setDecryptError("Vault is locked. Master key is required to decrypt credentials.");
            return;
        }

        async function decrypt() {
            setIsDecrypting(true);
            setDecryptedCreds(null);

            try {
                const creds = await decryptCreds(masterKey!, {
                    iv: vaultItem!.iv,
                    ciphertext: vaultItem!.encryptedData,
                });

                if (!isCancelled) {
                    setDecryptedCreds(creds);
                    setDecryptError(null);
                }
            } catch (err) {
                if (!isCancelled) {
                    console.error("Decryption failed:", err);
                    setDecryptError("Failed to decrypt credentials. The stored data may be corrupted or encrypted with a different key.");
                    setDecryptedCreds(null);
                }
            } finally {
                if (!isCancelled) {
                    setIsDecrypting(false);
                }
            }
        }

        decrypt();

        return () => {
            isCancelled = true;
        };
    }, [vaultItem?.id, vaultItem?.iv, vaultItem?.encryptedData, masterKey]);

    function copyToClipboard(text: string | undefined, field: string) {
        if (!text) return;
        navigator.clipboard?.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    }

    function handleDelete() {
    }

    function getFormattedWebsiteUrl(url?: string): string {
        if (!url) return "#";
        return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
    }

    function formatUpdatedTime(dateStr?: string): string {
        if (!dateStr) return "";
        try {
            const date = new Date(dateStr);
            return isNaN(date.getTime()) ? "" : `Updated ${formatDistanceToNow(date, { addSuffix: true })}`;
        } catch {
            return "";
        }
    }

    if (isLoading) {
        return (
            <div className="bg-card/50 flex-1 w-full flex items-center justify-center p-4">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!id) {
        return (
            <div className="bg-card/20 flex-1 w-full flex items-center justify-center p-6 select-none relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.06),transparent_60%)] pointer-events-none" />
                <div className="relative flex flex-col items-center max-w-sm text-center space-y-4">
                    <div className="relative flex items-center justify-center size-16 rounded-2xl bg-secondary/50 border border-border/60 shadow-lg backdrop-blur-sm">
                        <div className="absolute -inset-1 rounded-2xl bg-primary/10 blur-sm -z-10" />
                        <Shield className="size-7 text-primary/80 stroke-[1.75] animate-pulse" />
                    </div>

                    <div className="space-y-1.5">
                        <h3 className="text-sm font-medium tracking-tight text-foreground">
                            No item selected
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Select an item from the vault to inspect details, view security audit data, and decrypt stored credentials.
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/60 border border-border/60 text-[10px] font-mono text-muted-foreground/80">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Client-side AES-256-GCM memory safe</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!vaultItem) {
        return (
            <div className="bg-card/20 flex-1 w-full flex items-center justify-center p-6 select-none text-center">
                <div className="max-w-sm space-y-3">
                    <div className="size-12 rounded-2xl bg-muted/60 border border-border/60 mx-auto flex items-center justify-center text-muted-foreground">
                        <AlertCircle className="size-6 stroke-[1.75]" />
                    </div>
                    <h3 className="text-sm font-medium text-foreground">Item not found</h3>
                    <p className="text-xs text-muted-foreground">
                        The requested vault item could not be found or may have been deleted.
                    </p>
                </div>
            </div>
        );
    }

    const updatedText = formatUpdatedTime(vaultItem.updated);

    return (
        <div className="flex-1 bg-card/50 w-full flex justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl">
                <div className="flex items-start justify-between border-b pb-4 pt-2">
                    <div className="flex items-start gap-3">
                        <div className="p-1 bg-muted border rounded-lg size-10 flex items-center justify-center shrink-0">
                            <Globe className="size-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-foreground font-bold text-lg leading-tight">
                                {vaultItem.title || "Untitled Item"}
                            </h2>
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[11px] font-mono border">
                                    {vaultItem.category}
                                </span>
                                {updatedText && (
                                    <>
                                        <span className="text-muted-foreground/50">•</span>
                                        <span className="text-xs text-muted-foreground font-mono">
                                            {updatedText}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="rounded-md py-2 px-3 text-muted-foreground flex items-center gap-1.5 cursor-pointer text-xs"
                        >
                            <Edit3 className="size-3.5" />
                            <span className="font-mono">Edit</span>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="rounded-md py-2 px-3 flex items-center gap-1.5 cursor-pointer text-xs"
                        >
                            {false ? (
                                <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                                <Trash2 className="size-3.5" />
                            )}
                            <span className="font-mono">Delete</span>
                        </Button>
                    </div>
                </div>

                {decryptError && (
                    <div className="mt-4 p-3 rounded-lg border border-destructive/30 bg-destructive/10 flex items-start gap-2.5 text-xs text-destructive">
                        <AlertCircle className="size-4 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                            <p className="font-semibold">Decryption Warning</p>
                            <p className="text-[11px] opacity-90 leading-relaxed">{decryptError}</p>
                        </div>
                    </div>
                )}

                <div className="space-y-4 mt-5">
                    <div className="p-3.5 rounded-lg border border-border bg-card space-y-1">
                        <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wide">
                            Username / Identifier
                        </div>
                        <div className="flex items-center justify-between min-h-[28px]">
                            {isDecrypting ? (
                                <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                            ) : (
                                <span className="font-mono text-xs text-foreground select-all">
                                    {decryptedCreds?.login || (decryptError ? "—" : "None")}
                                </span>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={!decryptedCreds?.login || isDecrypting}
                                onClick={() => copyToClipboard(decryptedCreds?.login, "username")}
                                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-40"
                                title="Copy username"
                            >
                                {copiedField === "username" ? (
                                    <Check className="size-3.5 text-primary" />
                                ) : (
                                    <Copy className="size-3.5" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-lg border border-border bg-card space-y-1">
                        <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wide">
                            Password
                        </div>
                        <div className="flex items-center justify-between gap-2 min-h-[28px]">
                            {isDecrypting ? (
                                <div className="h-4 w-40 rounded bg-muted animate-pulse" />
                            ) : (
                                <span className="font-mono text-xs text-foreground tracking-wider select-all truncate">
                                    {decryptedCreds?.password
                                        ? showPassword
                                            ? decryptedCreds.password
                                            : "••••••••••••••••••••"
                                        : decryptError
                                        ? "—"
                                        : "••••••••••••••••••••"}
                                </span>
                            )}
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={!decryptedCreds?.password || isDecrypting}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="h-7 px-2 text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-40"
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-3.5" />
                                    ) : (
                                        <Eye className="size-3.5" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={!decryptedCreds?.password || isDecrypting}
                                    onClick={() => copyToClipboard(decryptedCreds?.password, "password")}
                                    className="h-7 px-2 text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-40"
                                    title="Copy password"
                                >
                                    {copiedField === "password" ? (
                                        <Check className="size-3.5 text-primary" />
                                    ) : (
                                        <Copy className="size-3.5" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-lg border border-border bg-card space-y-1">
                        <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wide">
                            Website
                        </div>
                        <div className="flex items-center justify-between min-h-[28px]">
                            <span className="font-mono text-xs text-foreground truncate max-w-md">
                                {vaultItem.website || "No website specified"}
                            </span>
                            {vaultItem.website && (
                                <a
                                    href={getFormattedWebsiteUrl(vaultItem.website)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline ml-2 shrink-0"
                                >
                                    <span>Open</span>
                                    <ExternalLink className="size-3" />
                                </a>
                            )}
                        </div>
                    </div>

                    {decryptedCreds?.description && (
                        <div className="p-3.5 rounded-lg border border-border bg-card space-y-1">
                            <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wide">
                                Secure Notes
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans">
                                {decryptedCreds.description}
                            </p>
                        </div>
                    )}

                    <div className="rounded-lg border border-border/70 bg-secondary/30 p-3 text-[11px] font-mono text-muted-foreground flex items-center justify-between my-8">
                        <span>Encrypted in AES-256-GCM</span>
                        <span className="text-primary flex items-center gap-1">
                            <Shield className="size-3" /> ZK-Verified
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}