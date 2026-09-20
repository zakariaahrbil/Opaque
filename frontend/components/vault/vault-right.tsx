'use client';
import { Check, CheckCheck, Copy, Edit3, ExternalLink, Eye, EyeOff, Globe, Shield, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { MockVaultItem } from "@/app/vault/page";

export function VaultRight({ items }: { items: MockVaultItem[] }) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    function copyToClipboard(text: string, field: string) {
        navigator.clipboard?.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    }

    const selectedItem = items[0];

    const [showPassword, setShowPassword] = useState(false);


    return (
        <div className="flex-1 bg-card/50 w-full flex justify-center p-4 ">
            <div className="w-full max-w-2xl">
                <div className="flex items-top justify-between border-b py-4">
                    <div className="flex items-top gap-3">
                        <div className="p-1 bg-muted border rounded-lg w-10 h-10  flex items-center justify-center">
                            <Globe className="size-5 text-primary" />
                        </div>
                        <div>
                            <span className="text-foreground font-bold text-lg">
                                Github
                            </span>
                            <div className="space-x-1">
                                <span className="p-1 rounded-md bg-muted text-muted-foreground text-[11px] font-mono border ">
                                    Social Media
                                </span>
                                <span className="text-muted-foreground/50">•</span>
                                <span className="text-xs text-muted-foreground">Updated 5 minutes ago</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant={"outline"} className="rounded-md py-2 px-4 text-muted-foreground flex items-center justify-center gap-2 cursor-pointer">
                            <Edit3 className="size-3.5" />
                            <span className="text-muted-foreground font-mono text-[12px]">
                                Edit
                            </span>
                        </Button>
                        <Button variant={"destructive"} className="rounded-md py-2 px-4 flex items-center gap-2 cursor-pointer">
                            <Trash2 className="size-3.5" />
                            <span className="text-destructive font-mono text-[12px]">
                                Delete
                            </span>
                        </Button>
                    </div>
                </div>
                <div className="space-y-4 mt-5">
                    <div className="p-3.5 rounded-lg border border-border bg-card space-y-1">
                        <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wide">
                            Identifiant / Email
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-foreground select-all">
                                {selectedItem.username}
                            </span>
                            <Button
                                variant="ghost"
                                onClick={() => copyToClipboard(selectedItem.username, "username")}
                                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
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
                            Mot de passe
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-xs text-foreground tracking-wider select-all">
                                {showPassword ? selectedItem.passwordPlaceholder : "••••••••••••••••••••"}
                            </span>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="h-7 px-2 text-muted-foreground hover:text-foreground cursor-pointer"
                                    title={showPassword ? "Hide" : "Show"}
                                >
                                    {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(selectedItem.passwordPlaceholder, "password")}
                                    className="h-7 px-2 font-mono text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                                    title="Copier"
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
                            Site Web
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-foreground truncate">
                                {selectedItem.website}
                            </span>
                            <a
                                href={selectedItem.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline"
                            >
                                <span>Open</span>
                                <ExternalLink className="size-3" />
                            </a>
                        </div>
                    </div>

                    {selectedItem.notes && (
                        <div className="p-3.5 rounded-lg border border-border bg-card space-y-1">
                            <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wide">
                                Secure Notes
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                                {selectedItem.notes}
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