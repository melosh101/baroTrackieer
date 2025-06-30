import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber } from "@/lib/data-utils"

interface SummaryCardProps {
  title: string
  total: number
  owned: number
  missing: number
  ownedDucats: number
  ownedCredits: number
  missingDucats: number
  missingCredits: number
}

export function SummaryCard({
  title,
  total,
  owned,
  missing,
  ownedDucats,
  ownedCredits,
  missingDucats,
  missingCredits,
}: SummaryCardProps) {
  const completionPercentage = total > 0 ? Math.round((owned / total) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{owned}</div>
            <div className="text-xs text-muted-foreground">Owned</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{missing}</div>
            <div className="text-xs text-muted-foreground">Missing</div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="text-center text-sm font-medium">{completionPercentage}% Complete</div>

        <div className="space-y-2 pt-2 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Missing Cost:</span>
            <div className="text-right">
              <div className="font-medium">{formatNumber(missingDucats)} Ducats</div>
              <div className="font-medium">{formatNumber(missingCredits)} Credits</div>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Owned Value:</span>
            <div className="text-right">
              <div className="font-medium text-green-600">{formatNumber(ownedDucats)} Ducats</div>
              <div className="font-medium text-green-600">{formatNumber(ownedCredits)} Credits</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
