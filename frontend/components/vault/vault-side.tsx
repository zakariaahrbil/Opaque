"use client"
import { Category } from "@/lib/api";
import { Building2, FileText, FolderOpen, KeyRound, Mail, Share2, Shield, Wrench } from "lucide-react";
import { ComponentType, useState } from "react";
import { Button } from "../ui/button";

const CATEGORIES: {
    name: Category | "All";
    label: string;
    icon: ComponentType<{ className?: string }>
}[] = [
        {
            name: "All",
            label: "All items",
            icon: FolderOpen
        },
        {
            name: "Social Media",
            label: "Social Media",
            icon: Share2
        },
        {
            name: "Bank",
            label: "Bank & Finance",
            icon: Building2
        },
        {
            name: "Email",
            label: "Emails",
            icon: Mail
        },
        {
            name: "Utils",
            label: "Utils",
            icon: Wrench
        },
        {
            name: "Documents",
            label: "Documents",
            icon: FileText
        },
        {
            name: "Others",
            label: "Others",
            icon: KeyRound
        }

    ]




export function VaultSide() {
    const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All")

    return (
        <aside className="flex flex-col w-full md:w-60 shrink-0 p-3 text-sm max-sm:border-b md:border-r">
            <div className="text-muted-foreground text-[11px] font-mono tracking-wider uppercase px-2 py-1.5">
                Categories
            </div>
            <nav className="flex flex-col gap-1.5 py-2">
                {CATEGORIES.map((c) => {
                    const Icon = c.icon
                    const count = 5
                    const isSelected = selectedCategory === c.name

                    return (
                        <Button
                            key={c.name}
                            onClick={() => setSelectedCategory(c.name)}
                            className={`flex items-center justify-between text-xs font-medium transition-colors rounded-md tracking-wider cursor-pointer
                                ${isSelected ?
                                    "bg-primary/15 text-primary border border-primary/40 hover:bg-primary/20 " :
                                    "bg-transparent text-muted-foreground hover:bg-card hover:text-foreground "
                                }
                                `
                            }
                        >
                            <div className="flex items-center gap-2">
                                <Icon className="size-3.5" />
                                <span >{c.label}</span>
                            </div>

                            <span className="px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground text-[10px] font-mono">{count}</span>
                        </Button>
                    )
                })}
            </nav>
            <div className="pt-4 hidden md:block mt-auto">
                <div className="bg-card rounded-md p-4 space-y-2 border border-border ">
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                        <Shield className="size-3.5 text-primary" />
                        <span>Zero-Knowledge</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                        AES-GCM keys remain strictly within your browser's memory.                    </p>
                </div>
            </div>
        </aside>
    );
}
