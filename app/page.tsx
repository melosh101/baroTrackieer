"use client"

import { useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SummaryCard } from "@/components/summary-card"
import { ItemList } from "@/components/item-list"
import { calculateTotals } from "@/lib/data-utils"
import { useBaroData } from "@/hooks/useBaroData"
import { useOwnedItems } from "@/hooks/useOwnedItems"
import { useImportExport } from "@/hooks/useImportExport"
import { ActionButtons } from "@/components/action-buttons"
import { OverallSummary } from "@/components/overall-summary"
import { PageSkeleton } from "@/components/page-skeleton"

export default function BaroInventoryManager() {
  const { itemsByCategory, allItems } = useBaroData()
  const {
    ownedItems,
    isLoaded,
    isSaving,
    toggleItem,
    toggleAllItems,
    setOwnedFromImport,
    resetItems,
  } = useOwnedItems()
  const { exportData, importData } = useImportExport()

  // Memoize calculations to prevent unnecessary recalculations
  const overallTotals = useMemo(
    () => calculateTotals(allItems, ownedItems),
    [allItems, ownedItems]
  )

  const categoryTotals = useMemo(() => ({
    misc: calculateTotals(itemsByCategory.misc, ownedItems),
    appearance: calculateTotals(itemsByCategory.appearance, ownedItems),
    mods: calculateTotals(itemsByCategory.mods, ownedItems),
    weapons: calculateTotals(itemsByCategory.weapons, ownedItems),
  }), [itemsByCategory, ownedItems])

  const handleExport = () => exportData(ownedItems)
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    importData(event, setOwnedFromImport)
  }

  if (!isLoaded) {
    return <PageSkeleton />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Baro Ki'teer Inventory Manager</h1>
            <p className="text-muted-foreground">Track your Void Trader purchases and calculate missing items</p>
          </div>

          <ActionButtons
            onExport={handleExport}
            onImport={handleImport}
            onReset={resetItems}
            isSaving={isSaving}
          />
        </div>

        {/* Overall Summary */}
        <OverallSummary {...overallTotals} />

        <Tabs defaultValue="misc" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="misc">Miscellaneous ({itemsByCategory.misc.length})</TabsTrigger>
            <TabsTrigger value="appearance">Appearance ({itemsByCategory.appearance.length})</TabsTrigger>
            <TabsTrigger value="mods">Mods ({itemsByCategory.mods.length})</TabsTrigger>
            <TabsTrigger value="weapons">Weapons ({itemsByCategory.weapons.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="misc" className="space-y-6">
            <SummaryCard title="Miscellaneous Items" {...categoryTotals.misc} />
            <ItemList
              items={itemsByCategory.misc}
              ownedItems={ownedItems}
              onToggleItem={toggleItem}
              onToggleAll={toggleAllItems}
            />
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <SummaryCard title="Appearance Items" {...categoryTotals.appearance} />
            <ItemList
              items={itemsByCategory.appearance}
              ownedItems={ownedItems}
              onToggleItem={toggleItem}
              onToggleAll={toggleAllItems}
            />
          </TabsContent>

          <TabsContent value="mods" className="space-y-6">
            <SummaryCard title="Mods" {...categoryTotals.mods} />
            <ItemList
              items={itemsByCategory.mods}
              ownedItems={ownedItems}
              onToggleItem={toggleItem}
              onToggleAll={toggleAllItems}
            />
          </TabsContent>

          <TabsContent value="weapons" className="space-y-6">
            <SummaryCard title="Weapons" {...categoryTotals.weapons} />
            <ItemList
              items={itemsByCategory.weapons}
              ownedItems={ownedItems}
              onToggleItem={toggleItem}
              onToggleAll={toggleAllItems}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
