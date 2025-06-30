"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ItemCard } from "./item-card"
import type { BaroItem } from "@/lib/data-utils"
import { Search, CheckSquare, Square } from "lucide-react"

interface ItemListProps {
  items: BaroItem[]
  ownedItems: Set<string>
  onToggleItem: (itemName: string) => void
  onToggleAll: (items: BaroItem[], owned: boolean) => void
}

export function ItemList({ items, ownedItems, onToggleItem, onToggleAll }: ItemListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const allOwned = filteredItems.every((item) => ownedItems.has(item.name))
  const someOwned = filteredItems.some((item) => ownedItems.has(item.name))

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => onToggleAll(filteredItems, !allOwned)}
          className="flex items-center gap-2"
        >
          {allOwned ? <Square className="h-4 w-4" /> : <CheckSquare className="h-4 w-4" />}
          {allOwned ? "Unmark All" : "Mark All"}
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredItems.length} of {items.length} items
        {someOwned && ` • ${filteredItems.filter((item) => ownedItems.has(item.name)).length} owned`}
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <ItemCard key={item.name} item={item} isOwned={ownedItems.has(item.name)} onToggle={onToggleItem} />
        ))}
      </div>
    </div>
  )
}
