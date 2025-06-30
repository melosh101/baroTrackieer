import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { type BaroItem, formatNumber } from "@/lib/data-utils"

interface ItemCardProps {
  item: BaroItem
  isOwned: boolean
  onToggle: (itemName: string) => void
}

export function ItemCard({ item, isOwned, onToggle }: ItemCardProps) {
  return (
    <Card className={`transition-all ${isOwned ? "bg-green-50 border-green-200" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox checked={isOwned} onCheckedChange={() => onToggle(item.name)} className="mt-1" />
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-sm leading-tight ${isOwned ? "line-through text-muted-foreground" : ""}`}>
              {item.name}
            </h3>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {formatNumber(item.ducatValue)} Ducats
              </Badge>
              <Badge variant="outline" className="text-xs">
                {formatNumber(item.creditValue)} Credits
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
