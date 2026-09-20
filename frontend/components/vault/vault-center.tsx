"use client"
import { MockVaultItem } from "@/app/vault/page";
import { Search } from "lucide-react";
import { useState } from "react";

export function VaultCenter({ items }: {
  items: MockVaultItem[]
}) {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedItem, setSelectedItem] = useState<MockVaultItem | null>(null);
  return (
    <div className="flex flex-col w-full md:w-80 lg:w-96 shrink-0 border-r p-3 gap-3">
      <div className="relative flex items-center ">
        <Search className="size-3.5 absolute left-3 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search an identifier..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-muted border rounded-md pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 font-sans"
        />
      </div>
      <div className="w-full flex flex-col">
        {
          items.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                }}
                className={`w-full text-left p-3.5 transition-colors cursor-pointer flex flex-col gap-1 border-l-2  ${isSelected
                    ? "bg-secondary/60 border-primary"
                    : "hover:bg-secondary/40 border-transparent"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground truncate">{item.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {item.category}
                  </span>
                </div>
                <span className="text-xs font-mono text-muted-foreground truncate">{item.username}</span>
                <span className="text-[10px] text-muted-foreground/60 font-mono mt-0.5">
                  {item.updatedAt}
                </span>
              </button>
            );
          })}
      </div>
    </div>
  )
}