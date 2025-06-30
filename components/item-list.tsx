"use client"

import { useState, useMemo, memo, useCallback } from "react"
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

export const ItemList = memo(function ItemList({ 
  items, 
  ownedItems, 
  onToggleItem, 
  onToggleAll 
}: ItemListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items
    const term = searchTerm.toLowerCase()
    return items.filter((item) => item.name.toLowerCase().includes(term))
  }, [items, searchTerm])

  const { allOwned, someOwned, ownedCount } = useMemo(() => {
    let ownedCount = 0
    let allOwned = true
    
    for (const item of filteredItems) {
      if (ownedItems.has(item.name)) {
        ownedCount++
      } else {
        allOwned = false
      }
    }
    
    return {
      allOwned: allOwned && filteredItems.length > 0,
      someOwned: ownedCount > 0,
      ownedCount
    }
  }, [filteredItems, ownedItems])

  const handleToggleAll = useCallback(() => {
    onToggleAll(filteredItems, !allOwned)
  }, [onToggleAll, filteredItems, allOwned])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={handleToggleAll}
          className="flex items-center gap-2"
        >
          {allOwned ? <Square className="h-4 w-4" /> : <CheckSquare className="h-4 w-4" />}
          {allOwned ? "Unmark All" : "Mark All"}
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredItems.length} of {items.length} items
        {someOwned && ` • ${ownedCount} owned`}
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <ItemCard 
            key={item.name} 
            item={item} 
            isOwned={ownedItems.has(item.name)} 
            onToggle={onToggleItem} 
          />
        ))}
      </div>
    </div>
  )
})
