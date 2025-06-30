"use client"

import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber } from "@/lib/data-utils"

interface OverallSummaryProps {
  total: number
  owned: number
  missing: number
  ownedDucats: number
  ownedCredits: number
  missingDucats: number
  missingCredits: number
}

export const OverallSummary = memo(function OverallSummary({
  total,
  owned,
  missing,
  ownedDucats,
  ownedCredits,
  missingDucats,
  missingCredits,
}: OverallSummaryProps) {
  const completionPercentage = total > 0 ? Math.round((owned / total) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{total}</div>
            <div className="text-sm text-muted-foreground">Total Items</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{owned}</div>
            <div className="text-sm text-muted-foreground">Owned</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{missing}</div>
            <div className="text-sm text-muted-foreground">Missing</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{completionPercentage}%</div>
            <div className="text-sm text-muted-foreground">Complete</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <h4 className="font-medium mb-2">Missing Items Cost:</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Ducats:</span>
                <span className="font-mono">{formatNumber(missingDucats)}</span>
              </div>
              <div className="flex justify-between">
                <span>Credits:</span>
                <span className="font-mono">{formatNumber(missingCredits)}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Owned Items Value:</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Ducats:</span>
                <span className="font-mono text-green-600">{formatNumber(ownedDucats)}</span>
              </div>
              <div className="flex justify-between">
                <span>Credits:</span>
                <span className="font-mono text-green-600">{formatNumber(ownedCredits)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
