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

const INITIAL_MOCK_ITEMS: MockVaultItem[] = [
  {
    id: "1",
    title: "GitHub",
    website: "https://github.com",
    category: "Social Media",
    username: "alex.dev@opaque.app",
    passwordPlaceholder: "ghp_secureKey9921_xK9",
    updatedAt: "Il y a 2 heures",
    notes: "Personal developer account with 2FA backup codes.",
  },
  {
    id: "2",
    title: "Proton Mail",
    website: "https://mail.proton.me",
    category: "Email",
    username: "security@opaque.vault",
    passwordPlaceholder: "prm_98!Fk_AlphaLyrae#2",
    updatedAt: "Hier",
    notes: "Encrypted mail communication gateway.",
  },
  {
    id: "3",
    title: "Revolut Business",
    website: "https://revolut.com",
    category: "Bank",
    username: "finance@company.io",
    passwordPlaceholder: "rev_FinPass_992#vault",
    updatedAt: "Il y a 3 jours",
  },
  {
    id: "4",
    title: "AWS Console",
    website: "https://aws.amazon.com",
    category: "Utils",
    username: "root_admin",
    passwordPlaceholder: "AWS_rootMaster_!99801",
    updatedAt: "Il y a 1 semaine",
  },
  {
    id: "5",
    title: "Notion Workspace",
    website: "https://notion.so",
    category: "Documents",
    username: "team.lead@opaque.app",
    passwordPlaceholder: "notion_secret_token_18",
    updatedAt: "Il y a 2 semaines",
  },
];


export default function dash() {
    return (
        <div className="max-w-screen min-h-screen flex flex-col">
            <VaultNav />
            <div className="flex flex-col md:flex-row w-full overflow-hidden flex-1">
                <VaultSide />
                <VaultCenter items={INITIAL_MOCK_ITEMS}/>
                <VaultRight items={INITIAL_MOCK_ITEMS}/>
            </div>
        </div>
    )
}