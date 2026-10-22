"use client";

import { useState, useEffect, useRef } from "react";
import { AlertCircle, AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { Button } from "../ui/button";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  itemTitle: string;
  isDeleting?: boolean;
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemTitle,
  isDeleting = false,
}: DeleteModalProps) {
  const [confirmationInput, setConfirmationInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isMatch = confirmationInput.trim().toLowerCase() === "delete";

  useEffect(() => {
    if (isOpen) {
      setConfirmationInput("");
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!isMatch || isDeleting) return;

    try {
      setError(null);
      await onConfirm();
      onClose();
    } catch (err) {
      console.error("Delete failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete item. Please try again."
      );
    }
  }

  return (
    <div
      className="fixed inset-0 bg-background/80 z-50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={() => {
        if (!isDeleting) onClose();
      }}
    >
      <div
        className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-card/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
              <Trash2 className="size-4.5 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Delete Vault Item
              </h2>
              <p className="text-[11px] font-mono text-muted-foreground">
                Permanent zero-knowledge wipe
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="size-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
          >
            <X className="size-4" />
          </Button>
        </div>

        <form onSubmit={handleConfirm} className="p-5 space-y-4">
          <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/10 flex items-start gap-3 text-xs text-destructive">
            <AlertTriangle className="size-4 shrink-0 mt-0.5 text-destructive" />
            <div className="space-y-1">
              <p className="font-semibold text-destructive">This action cannot be undone</p>
              <p className="text-[11px] opacity-90 leading-relaxed text-destructive/90">
                The item <span className="font-mono font-bold text-foreground bg-secondary/80 px-1 py-0.5 rounded border border-border">{itemTitle}</span> and its encrypted credentials will be permanently erased.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirm-delete-input"
              className="text-xs font-mono text-muted-foreground block"
            >
              Type <span className="text-destructive font-semibold font-mono">delete</span> to confirm:
            </label>
            <div className="relative">
              <input
                id="confirm-delete-input"
                ref={inputRef}
                type="text"
                disabled={isDeleting}
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder="delete"
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs font-mono text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-destructive focus:border-destructive transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-md border border-destructive/30 bg-destructive/10 flex items-center gap-2 text-xs text-destructive">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isDeleting}
              className="font-mono text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={!isMatch || isDeleting}
              className="font-mono text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="size-3.5" />
                  <span>Delete Item</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
