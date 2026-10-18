"use client"
import { AuthGuard } from "@/components/auth/auth-guard";
import { EditOverlay } from "@/components/vault/edit-overlay";
import { VaultCenter } from "@/components/vault/vault-center";
import { VaultNav } from "@/components/vault/vault-nav";
import { VaultRight } from "@/components/vault/vault-right";
import { VaultSide } from "@/components/vault/vault-side";
import { useState } from "react";


export default function dash() {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  return (
    <AuthGuard>
      <div className="max-w-screen min-h-screen flex flex-col">
        <VaultNav setOpen={() => setOpen(true)} />
        <div className="flex flex-col md:flex-row w-full overflow-hidden flex-1">
          <VaultSide />
          <VaultCenter />
          <VaultRight />
        </div>
      </div>
      <EditOverlay isOpen={open} onClose={() => setOpen(false)} />
    </AuthGuard>
  )
}