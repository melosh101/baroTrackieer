"use client"

import { memo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ItemCard } from "@/components/item-card"
import type { BaroItem } from "@/lib/data-utils"

interface ItemGridProps {
  items: BaroItem[]
  ownedItems: Set<string>
  onToggleItem: (itemName: string) => void
}

export const ItemGrid = memo(function ItemGrid({ 
  items, 
  ownedItems, 
  onToggleItem 
}: ItemGridProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">No items found matching your filters.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.name} className="relative">
          <ItemCard 
            item={item} 
            isOwned={ownedItems.has(item.name)} 
            onToggle={onToggleItem} 
          />
          <Badge variant="outline" className="absolute top-2 right-2 text-xs">
            {item.category === "Miscellaneous" ? "Misc" : item.category}
          </Badge>
        </div>
      ))}
    </div>
  )
})
