import { AuthGuard } from "@/components/auth/auth-guard";
import { VaultCenter } from "@/components/vault/vault-center";
import { VaultNav } from "@/components/vault/vault-nav";
import { VaultRight } from "@/components/vault/vault-right";
import { VaultSide } from "@/components/vault/vault-side";
import { Category } from "@/lib/api";

export interface MockVaultItem {
  id: string;
  title: string;
  website: string;
  category: Category;
  username: string;
  passwordPlaceholder: string;
  updatedAt: string;
  notes?: string;
}


export default function dash() {

  return (
    <AuthGuard>
      <div className="max-w-screen min-h-screen flex flex-col">
        <VaultNav />
        <div className="flex flex-col md:flex-row w-full overflow-hidden flex-1">
          <VaultSide />
          <VaultCenter />
          <VaultRight />
        </div>
      </div>
    </AuthGuard>
  )
}