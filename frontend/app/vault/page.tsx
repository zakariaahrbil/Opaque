"use client"
import { AuthGuard } from "@/components/auth/auth-guard";
import { EditOverlay } from "@/components/vault/edit-overlay";
import { LockView } from "@/components/vault/lock-view";
import { VaultCenter } from "@/components/vault/vault-center";
import { VaultNav } from "@/components/vault/vault-nav";
import { VaultRight } from "@/components/vault/vault-right";
import { VaultSide } from "@/components/vault/vault-side";
import { VaultItemUpdate } from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useState } from "react";


export default function dash() {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VaultItemUpdate | undefined>();

  const isVaultUnlocked = useAuthStore((s) => s.isVaultUnlocked());

  return (
    <AuthGuard>
      <div className="max-w-screen min-h-screen flex flex-col">
        <VaultNav setOpen={() => { setOpen(true); setSelectedItem(undefined); }} />
        {!isVaultUnlocked ?
          <LockView />
          :
          <div className="flex flex-col md:flex-row w-full overflow-hidden flex-1">
            <VaultSide />
            <VaultCenter />
            <VaultRight setOpen={() => setOpen(true)} setItem={(item: VaultItemUpdate) => setSelectedItem(item)} />
          </div>}
      </div>
      <EditOverlay isOpen={open} onClose={() => setOpen(false)} initialData={selectedItem} />
    </AuthGuard>
  )
}