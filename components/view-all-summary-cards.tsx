"use client"

import { memo } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface SummaryStats {
  total: number
  owned: number
  missing: number
}

interface ViewAllSummaryCardsProps {
  totals: SummaryStats
}

export const ViewAllSummaryCards = memo(function ViewAllSummaryCards({ 
  totals 
}: ViewAllSummaryCardsProps) {
  const completionPercentage = totals.total > 0 ? Math.round((totals.owned / totals.total) * 100) : 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{totals.total}</div>
          <div className="text-sm text-muted-foreground">Total Items</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{totals.owned}</div>
          <div className="text-sm text-muted-foreground">Owned</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{totals.missing}</div>
          <div className="text-sm text-muted-foreground">Missing</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{completionPercentage}%</div>
          <div className="text-sm text-muted-foreground">Complete</div>
        </CardContent>
      </Card>
    </div>
  )
})
