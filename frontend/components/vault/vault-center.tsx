"use client"
import { MockVaultItem } from "@/app/vault/page";
import { VaultItemResponse } from "@/lib/api";
import { useGetVaultItems } from "@/lib/hooks/useVaultItems";
import { AlertCircle, FolderOpen, RotateCcw, Search, SearchX } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns"

export function VaultCenter() {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedItem, setSelectedItem] = useState<VaultItemResponse | null>(null);
  const { data, isLoading, isError, error, refetch } = useGetVaultItems()

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (selectedItem) {
      const params = new URLSearchParams(searchParams)
      params.set("itemId", selectedItem.id)
      router.push(`${pathname}?${params.toString()}`)
    }
  }, [selectedItem])

  const category = searchParams.get("category");
  const filteredData = data?.filter((item) => {
    const matchesCategory = !category || category === "All" || item.category === category;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  function removeHttp(website: string) {
    return website.replace("https://", "").replace("http://", "")
  }

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
        {isLoading ? (
          <div className="flex flex-col">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-full p-3.5 flex flex-col gap-2 border-l-2 border-transparent"
              >
                <div className="flex items-center justify-between">
                  <div className="h-3.5 w-28 rounded bg-gradient-to-r from-muted/80 via-muted-foreground/20 to-muted/80 bg-[length:200%_100%] animate-pulse" />
                  <div className="h-4 w-16 rounded bg-gradient-to-r from-muted/80 via-muted-foreground/20 to-muted/80 bg-[length:200%_100%] animate-pulse" />
                </div>
                <div className="h-3 w-36 rounded bg-gradient-to-r from-muted/60 via-muted-foreground/15 to-muted/60 bg-[length:200%_100%] animate-pulse" />
                <div className="h-2.5 w-20 rounded bg-gradient-to-r from-muted/40 via-muted-foreground/10 to-muted/40 bg-[length:200%_100%] animate-pulse mt-0.5" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-14 px-4 text-center space-y-3">
            <div className="size-11 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive shadow-sm">
              <AlertCircle className="size-5 stroke-[1.75]" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground tracking-tight">
                Failed to load vault items
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[220px]">
                {error?.message || "Could not synchronize with the vault server."}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium border border-border/60 transition-colors cursor-pointer mt-1"
            >
              <RotateCcw className="size-3.5 text-muted-foreground" />
              <span>Retry</span>
            </button>
          </div>
        ) : !filteredData || filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-3">
            <div className="size-11 rounded-2xl bg-secondary/50 border border-border/70 flex items-center justify-center text-muted-foreground shadow-sm">
              {searchQuery ? (
                <SearchX className="size-5 text-muted-foreground/70" />
              ) : (
                <FolderOpen className="size-5 text-muted-foreground/70" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-foreground tracking-tight">
                {searchQuery ? "No matches found" : "No items in category"}
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[200px]">
                {searchQuery
                  ? `No items match "${searchQuery}"`
                  : "This category currently has no stored items."}
              </p>
            </div>
          </div>
        ) : (
          filteredData.map((item) => {
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
                <span className="text-xs font-mono text-muted-foreground truncate">{removeHttp(item.website || "")}</span>
                <span className="text-[10px] text-muted-foreground/60 font-mono mt-0.5">
                  {formatDistanceToNow(new Date(item.updated))}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}