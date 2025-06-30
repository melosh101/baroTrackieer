"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SummaryCard } from "@/components/summary-card"
import { ItemList } from "@/components/item-list"
import { type BaroItem, parseItemData, calculateTotals, formatNumber } from "@/lib/data-utils"
import { Download, Upload, RotateCcw, List } from "lucide-react"

// NEW
import miscData from "@/data/misc"
import appearanceData from "@/data/appearance"
import modsData from "@/data/mods"
import weaponsData from "@/data/weapons"
import AuthButtons from "@/components/AuthButtons"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function BaroInventoryManager() {
  const [ownedItems, setOwnedItems] = useState<Set<string>>(new Set())
  const [isLoaded, setIsLoaded] = useState(false)
  const currentUser = useQuery(api.userFunctions.currentUser);
  const mutateSaveState = useMutation(api.userFunctions.setUserSaveState)
  // Parse all data
  const allItems = [
    ...parseItemData(miscData, "Miscellaneous"),
    ...parseItemData(appearanceData, "Appearance"),
    ...parseItemData(modsData, "Mods"),
    ...parseItemData(weaponsData, "Weapons"),
  ]

  const itemsByCategory = {
    misc: parseItemData(miscData, "Miscellaneous"),
    appearance: parseItemData(appearanceData, "Appearance"),
    mods: parseItemData(modsData, "Mods"),
    weapons: parseItemData(weaponsData, "Weapons"),
  }

  // Load owned items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("baro-owned-items")
    if (!currentUser) {
      if (saved) {
        setOwnedItems(new Set(JSON.parse(saved)))
      }
      setIsLoaded(true)
      return;
    }
    const data = useQuery(api.userFunctions.getUserSaveState);
    if (data) {
      setOwnedItems(new Set(data))
    } else {
      setOwnedItems(new Set())
    }
    setIsLoaded(true)
  }, [])

  // Save owned items to localStorage
  useEffect(() => {
    if (isLoaded) {
      if (!currentUser) {
        localStorage.setItem("baro-owned-items", JSON.stringify([...ownedItems]))
        return;
      }

      mutateSaveState({
        ownedItems: [...ownedItems],
      }).then(() => {
        localStorage.setItem("baro-owned-items", JSON.stringify([...ownedItems]))
      }).catch((error) => {
        console.error("Failed to save owned items:", error)
      })

    }
  }, [ownedItems, isLoaded])

  const toggleItem = (itemName: string) => {
    setOwnedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemName)) {
        newSet.delete(itemName)
      } else {
        newSet.add(itemName)
      }
      return newSet
    })
  }

  const toggleAllItems = (items: BaroItem[], owned: boolean) => {
    setOwnedItems((prev) => {
      const newSet = new Set(prev)
      items.forEach((item) => {
        if (owned) {
          newSet.add(item.name)
        } else {
          newSet.delete(item.name)
        }
      })
      return newSet
    })
  }

  const exportData = () => {
    const data = {
      ownedItems: [...ownedItems],
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "baro-inventory.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.ownedItems && Array.isArray(data.ownedItems)) {
          setOwnedItems(new Set(data.ownedItems))
        }
      } catch (error) {
        alert("Invalid file format")
      }
    }
    reader.readAsText(file)
  }

  const resetData = () => {
    if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      setOwnedItems(new Set())
    }
  }

  const overallTotals = calculateTotals(allItems, ownedItems)

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Baro Ki'teer Inventory Manager</h1>
            <p className="text-muted-foreground">Track your Void Trader purchases and calculate missing items</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/view-all")}
              className="flex items-center gap-2 bg-transparent"
            >
              <List className="h-4 w-4" />
              View All
            </Button>
            <Button variant="outline" onClick={exportData} className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <label>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent" asChild>
                <span>
                  <Upload className="h-4 w-4" />
                  Import
                </span>
              </Button>
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
            <Button variant="outline" onClick={resetData} className="flex items-center gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <AuthButtons />
          </div>
        </div>

        {/* Overall Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{overallTotals.total}</div>
                <div className="text-sm text-muted-foreground">Total Items</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{overallTotals.owned}</div>
                <div className="text-sm text-muted-foreground">Owned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{overallTotals.missing}</div>
                <div className="text-sm text-muted-foreground">Missing</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round((overallTotals.owned / overallTotals.total) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <h4 className="font-medium mb-2">Missing Items Cost:</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Ducats:</span>
                    <span className="font-mono">{formatNumber(overallTotals.missingDucats)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Credits:</span>
                    <span className="font-mono">{formatNumber(overallTotals.missingCredits)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Owned Items Value:</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Ducats:</span>
                    <span className="font-mono text-green-600">{formatNumber(overallTotals.ownedDucats)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Credits:</span>
                    <span className="font-mono text-green-600">{formatNumber(overallTotals.ownedCredits)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="misc" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="misc">Miscellaneous ({itemsByCategory.misc.length})</TabsTrigger>
            <TabsTrigger value="appearance">Appearance ({itemsByCategory.appearance.length})</TabsTrigger>
            <TabsTrigger value="mods">Mods ({itemsByCategory.mods.length})</TabsTrigger>
            <TabsTrigger value="weapons">Weapons ({itemsByCategory.weapons.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="misc" className="space-y-6">
            <SummaryCard title="Miscellaneous Items" {...calculateTotals(itemsByCategory.misc, ownedItems)} />
            <ItemList
              items={itemsByCategory.misc}
              ownedItems={ownedItems}
              onToggleItem={toggleItem}
              onToggleAll={toggleAllItems}
            />
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <SummaryCard title="Appearance Items" {...calculateTotals(itemsByCategory.appearance, ownedItems)} />
            <ItemList
              items={itemsByCategory.appearance}
              ownedItems={ownedItems}
              onToggleItem={toggleItem}
              onToggleAll={toggleAllItems}
            />
          </TabsContent>

          <TabsContent value="mods" className="space-y-6">
            <SummaryCard title="Mods" {...calculateTotals(itemsByCategory.mods, ownedItems)} />
            <ItemList
              items={itemsByCategory.mods}
              ownedItems={ownedItems}
              onToggleItem={toggleItem}
              onToggleAll={toggleAllItems}
            />
          </TabsContent>

          <TabsContent value="weapons" className="space-y-6">
            <SummaryCard title="Weapons" {...calculateTotals(itemsByCategory.weapons, ownedItems)} />
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
