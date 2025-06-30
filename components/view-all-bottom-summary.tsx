"use client"

import { memo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { formatNumber } from "@/lib/data-utils"

interface BottomSummaryProps {
  visibleTotals: {
    missingDucats: number
    missingCredits: number
    ownedDucats: number
    ownedCredits: number
  }
  showSummary: boolean
}

export const ViewAllBottomSummary = memo(function ViewAllBottomSummary({ 
  visibleTotals, 
  showSummary 
}: BottomSummaryProps) {
  if (!showSummary) return null

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Visible Items Cost:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Missing Ducats:</span>
                <span className="font-mono">{formatNumber(visibleTotals.missingDucats)}</span>
              </div>
              <div className="flex justify-between">
                <span>Missing Credits:</span>
                <span className="font-mono">{formatNumber(visibleTotals.missingCredits)}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Visible Items Value:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Owned Ducats:</span>
                <span className="font-mono text-green-600">{formatNumber(visibleTotals.ownedDucats)}</span>
              </div>
              <div className="flex justify-between">
                <span>Owned Credits:</span>
                <span className="font-mono text-green-600">{formatNumber(visibleTotals.ownedCredits)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
