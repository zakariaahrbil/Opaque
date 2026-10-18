"use client";

import { useState, useEffect } from "react";
import {
  X,
  Shield,
  Globe,
  User,
  KeyRound,
  Eye,
  EyeOff,
  FileText,
  Sparkles,
  Lock,
  FolderOpen,
  Share2,
  Wrench,
  Building2,
  Mail,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { addVaultItem, Category, VaultItemRequest } from "@/lib/api";
import { useForm } from "react-hook-form";
import { vaultItemSchema, vaultItemType } from "@/lib/validations/vault";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Creds, encryptCreds } from "@/app/utils/crypt";

const CATEGORIES: { label: Category; icon: typeof Shield }[] = [
  { label: "Social Media", icon: Share2 },
  { label: "Utils", icon: Wrench },
  { label: "Bank", icon: Building2 },
  { label: "Email", icon: Mail },
  { label: "Documents", icon: FileText },
  { label: "Others", icon: FolderOpen },
];

interface EditOverlayProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialData?: {
    id?: string;
    title?: string;
    category?: Category;
    website?: string;
    username?: string;
    password?: string;
    description?: string;
  };
}

export function EditOverlay({
  isOpen = false,
  onClose,
  initialData,
}: EditOverlayProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<vaultItemType>({
    defaultValues: {
      title: initialData?.title || "",
      category: initialData?.category || "Others",
      username: initialData?.username || "",
      password: initialData?.password || "",
      website: initialData?.website || "",
      description: initialData?.description || "",
    },
    resolver: zodResolver(vaultItemSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        title: initialData?.title || "",
        category: initialData?.category || "Others",
        username: initialData?.username || "",
        password: initialData?.password || "",
        website: initialData?.website || "",
        description: initialData?.description || "",
      });
      clearErrors();
      setShowPassword(false);
    }
  }, [isOpen, initialData, reset, clearErrors]);

  function handleClose() {
    clearErrors();
    reset();
    setShowPassword(false);
    onClose?.();
  }

  const selectedCategory = watch("category");

  function generatePassword() {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
    let generated = "";
    for (let i = 0; i < 20; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setValue("password", generated, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setShowPassword(true);
  }

  async function handleFormSubmit(data: vaultItemType) {
    const id = initialData?.id;
    if (!id) {
      try {
        const masterKey = useAuthStore.getState().masterKey;
        if (!masterKey) {
          throw new Error("Master key not found");
        }
        const creds: Creds = {
          login: data.username,
          password: data.password,
          description: data.description || "",
        }
        const encryptedData = await encryptCreds(masterKey, creds);
        const vaultItemRequest: VaultItemRequest = {
          title: data.title,
          website: data.website || "",
          category: data.category,
          encryptedData: encryptedData.ciphertext,
          iv: encryptedData.iv
        }
        await addVaultItem(vaultItemRequest);
      } catch (error) {
        console.error(error);
      }
    } else {
      // update vault item
    }
    handleClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-background/80 z-50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-xl max-h-[85vh] h-full bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0 bg-card/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Shield className="size-4.5 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                {initialData?.id ? "Edit Vault Item" : "New Vault Item"}
              </h2>
              <p className="text-[11px] font-mono text-muted-foreground">
                Zero-Knowledge Encrypted Item
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary/80 border border-border text-[10px] font-mono text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              AES-256-GCM
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="size-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
              title="Close modal"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <form
          id="vault-item-form"
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5 space-y-5"
        >
          <div className="space-y-1.5 group">
            <label
              htmlFor="item-title"
              className={cn(
                "text-xs font-mono transition-colors flex items-center justify-between",
                errors.title
                  ? "text-destructive"
                  : "text-muted-foreground group-focus-within:text-primary"
              )}
            >
              <span>Item Title *</span>
              <span className="text-[10px] text-muted-foreground/60 font-sans">
                Displayed in vault list
              </span>
            </label>
            <div
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg border bg-secondary/20 transition-colors",
                errors.title
                  ? "border-destructive bg-destructive/5"
                  : "border-border group-focus-within:border-primary/60 group-focus-within:bg-secondary/40"
              )}
            >
              <KeyRound
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  errors.title
                    ? "text-destructive"
                    : "text-muted-foreground group-focus-within:text-primary"
                )}
              />
              <input
                id="item-title"
                type="text"
                {...register("title")}
                placeholder="e.g. GitHub Workspace"
                className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/40 outline-none font-sans"
              />
            </div>
            {errors.title && (
              <p className="text-[11px] font-mono text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground flex items-center justify-between">
              <span>Category *</span>
              <span className="text-[10px] text-muted-foreground/60 font-sans">
                For folder filtering
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.label;
                return (
                  <button
                    type="button"
                    key={cat.label}
                    onClick={() =>
                      setValue("category", cat.label, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono border transition-all cursor-pointer ${isSelected
                        ? "bg-primary/15 text-primary border-primary/50 shadow-sm"
                        : "bg-secondary/20 text-muted-foreground border-border hover:bg-secondary/40 hover:text-foreground"
                      }`}
                  >
                    <Icon className="size-3.5 shrink-0" />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p className="text-[11px] font-mono text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5 group">
            <label
              htmlFor="item-website"
              className={cn(
                "text-xs font-mono transition-colors flex items-center justify-between",
                errors.website
                  ? "text-destructive"
                  : "text-muted-foreground group-focus-within:text-primary"
              )}
            >
              <span>Website URL</span>
              <span className="text-[10px] text-muted-foreground/60 font-sans">
                Optional
              </span>
            </label>
            <div
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg border bg-secondary/20 transition-colors",
                errors.website
                  ? "border-destructive bg-destructive/5"
                  : "border-border group-focus-within:border-primary/60 group-focus-within:bg-secondary/40"
              )}
            >
              <Globe
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  errors.website
                    ? "text-destructive"
                    : "text-muted-foreground group-focus-within:text-primary"
                )}
              />
              <input
                id="item-website"
                type="text"
                {...register("website")}
                placeholder="https://github.com"
                className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/40 outline-none font-mono"
              />
            </div>
            {errors.website && (
              <p className="text-[11px] font-mono text-destructive">
                {errors.website.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5 group">
            <label
              htmlFor="item-username"
              className={cn(
                "text-xs font-mono transition-colors",
                errors.username
                  ? "text-destructive"
                  : "text-muted-foreground group-focus-within:text-primary"
              )}
            >
              Username / Email *
            </label>
            <div
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg border bg-secondary/20 transition-colors",
                errors.username
                  ? "border-destructive bg-destructive/5"
                  : "border-border group-focus-within:border-primary/60 group-focus-within:bg-secondary/40"
              )}
            >
              <User
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  errors.username
                    ? "text-destructive"
                    : "text-muted-foreground group-focus-within:text-primary"
                )}
              />
              <input
                id="item-username"
                type="text"
                {...register("username")}
                placeholder="user@example.com"
                className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/40 outline-none font-mono"
              />
            </div>
            {errors.username && (
              <p className="text-[11px] font-mono text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5 group">
            <div className="flex items-center justify-between">
              <label
                htmlFor="item-password"
                className={cn(
                  "text-xs font-mono transition-colors",
                  errors.password
                    ? "text-destructive"
                    : "text-muted-foreground group-focus-within:text-primary"
                )}
              >
                Password *
              </label>
              <button
                type="button"
                onClick={generatePassword}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-primary hover:text-primary/80 transition-colors cursor-pointer"
              >
                <Sparkles className="size-3" />
                <span>Generate Strong</span>
              </button>
            </div>
            <div
              className={cn(
                "flex items-center gap-2.5 px-3 py-1.5 rounded-lg border bg-secondary/20 transition-colors",
                errors.password
                  ? "border-destructive bg-destructive/5"
                  : "border-border group-focus-within:border-primary/60 group-focus-within:bg-secondary/40"
              )}
            >
              <Lock
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  errors.password
                    ? "text-destructive"
                    : "text-muted-foreground group-focus-within:text-primary"
                )}
              />
              <input
                id="item-password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter password..."
                className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/40 outline-none font-mono"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="size-7 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-3.5" />
                ) : (
                  <Eye className="size-3.5" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-[11px] font-mono text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5 group">
            <label
              htmlFor="item-notes"
              className={cn(
                "text-xs font-mono transition-colors flex items-center justify-between",
                errors.description
                  ? "text-destructive"
                  : "text-muted-foreground group-focus-within:text-primary"
              )}
            >
              <span>Secure Notes</span>
              <span className="text-[10px] text-muted-foreground/60 font-sans">
                Encrypted with AES-256-GCM
              </span>
            </label>
            <div
              className={cn(
                "flex items-start gap-2.5 px-3 py-2 rounded-lg border bg-secondary/20 transition-colors",
                errors.description
                  ? "border-destructive bg-destructive/5"
                  : "border-border group-focus-within:border-primary/60 group-focus-within:bg-secondary/40"
              )}
            >
              <FileText
                className={cn(
                  "size-4 shrink-0 mt-0.5 transition-colors",
                  errors.description
                    ? "text-destructive"
                    : "text-muted-foreground group-focus-within:text-primary"
                )}
              />
              <textarea
                id="item-notes"
                rows={3}
                {...register("description")}
                placeholder="2FA backup codes, PIN, or additional confidential notes..."
                className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/40 outline-none font-sans resize-none leading-relaxed custom-scrollbar"
              />
            </div>
            {errors.description && (
              <p className="text-[11px] font-mono text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </form>

        <div className="px-6 py-3.5 border-t border-border flex items-center justify-between shrink-0 bg-card/80 backdrop-blur-md">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            <Button
              form="vault-item-form"
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="text-xs font-mono cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Lock className="size-3.5" />
              )}
              <span>{initialData?.id ? "Update Item" : "Save Item"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}