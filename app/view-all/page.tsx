"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ItemCard } from "@/components/item-card"
import { parseItemData, calculateTotals, formatNumber } from "@/lib/data-utils"
import { ArrowLeft, Search, Filter, SortAsc, SortDesc, CheckSquare, Square } from "lucide-react"

// Import the data
import miscData from "@/data/misc"
import appearanceData from "@/data/appearance"
import modsData from "@/data/mods"
import weaponsData from "@/data/weapons"

type SortOption = "name" | "ducats" | "credits" | "category"
type FilterOption = "all" | "owned" | "missing" | "misc" | "appearance" | "mods" | "weapons"

export default function ViewAllPage() {
  const [ownedItems, setOwnedItems] = useState<Set<string>>(new Set())
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })

  // Parse all data
  const allItems = useMemo(
    () => [
      ...parseItemData(miscData, "Miscellaneous"),
      ...parseItemData(appearanceData, "Appearance"),
      ...parseItemData(modsData, "Mods"),
      ...parseItemData(weaponsData, "Weapons"),
    ],
    [],
  )

  // Load owned items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("baro-owned-items")
    if (saved) {
      setOwnedItems(new Set(JSON.parse(saved)))
    }
    setIsLoaded(true)
  }, [])

  // Save owned items to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("baro-owned-items", JSON.stringify([...ownedItems]))
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

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    const filtered = allItems.filter((item) => {
      // Search filter
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Category filter
      if (filterBy === "misc" && item.category !== "Miscellaneous") return false
      if (filterBy === "appearance" && item.category !== "Appearance") return false
      if (filterBy === "mods" && item.category !== "Mods") return false
      if (filterBy === "weapons" && item.category !== "Weapons") return false

      // Ownership filter
      if (filterBy === "owned" && !ownedItems.has(item.name)) return false
      if (filterBy === "missing" && ownedItems.has(item.name)) return false

      // Price range filter
      if (priceRange.min && item.ducatValue < Number.parseInt(priceRange.min)) return false
      if (priceRange.max && item.ducatValue > Number.parseInt(priceRange.max)) return false

      return true
    })

    // Sort items
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "ducats":
          comparison = a.ducatValue - b.ducatValue
          break
        case "credits":
          comparison = a.creditValue - b.creditValue
          break
        case "category":
          comparison = a.category.localeCompare(b.category)
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [allItems, searchTerm, sortBy, sortOrder, filterBy, priceRange, ownedItems])

  const toggleAllVisible = () => {
    const allOwned = filteredAndSortedItems.every((item) => ownedItems.has(item.name))

    setOwnedItems((prev) => {
      const newSet = new Set(prev)
      filteredAndSortedItems.forEach((item) => {
        if (allOwned) {
          newSet.delete(item.name)
        } else {
          newSet.add(item.name)
        }
      })
      return newSet
    })
  }

  const totals = calculateTotals(allItems, ownedItems)
  const visibleTotals = calculateTotals(filteredAndSortedItems, ownedItems)

  const allVisibleOwned =
    filteredAndSortedItems.length > 0 && filteredAndSortedItems.every((item) => ownedItems.has(item.name))

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">All Baro Ki'teer Items</h1>
              <p className="text-muted-foreground">Complete inventory view with advanced filtering</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
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
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((totals.owned / totals.total) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="misc">Miscellaneous</SelectItem>
                    <SelectItem value="appearance">Appearance</SelectItem>
                    <SelectItem value="mods">Mods</SelectItem>
                    <SelectItem value="weapons">Weapons</SelectItem>
                    <SelectItem value="owned">Owned Only</SelectItem>
                    <SelectItem value="missing">Missing Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="ducats">Ducats</SelectItem>
                    <SelectItem value="credits">Credits</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Order</label>
                <Button
                  variant="outline"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="w-full justify-start"
                >
                  {sortOrder === "asc" ? (
                    <>
                      <SortAsc className="h-4 w-4 mr-2" />
                      Ascending
                    </>
                  ) : (
                    <>
                      <SortDesc className="h-4 w-4 mr-2" />
                      Descending
                    </>
                  )}
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Actions</label>
                <Button variant="outline" onClick={toggleAllVisible} className="w-full justify-start bg-transparent">
                  {allVisibleOwned ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Unmark All
                    </>
                  ) : (
                    <>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Mark All
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">Ducat Price Range</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>
            Showing {filteredAndSortedItems.length} of {allItems.length} items
          </span>
          {visibleTotals.owned > 0 && <Badge variant="secondary">{visibleTotals.owned} owned</Badge>}
          {visibleTotals.missing > 0 && <Badge variant="outline">{visibleTotals.missing} missing</Badge>}
          {visibleTotals.missingDucats > 0 && (
            <Badge variant="destructive">{formatNumber(visibleTotals.missingDucats)} ducats needed</Badge>
          )}
        </div>

        {/* Items Grid */}
        {filteredAndSortedItems.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedItems.map((item) => (
              <div key={item.name} className="relative">
                <ItemCard item={item} isOwned={ownedItems.has(item.name)} onToggle={toggleItem} />
                <Badge variant="outline" className="absolute top-2 right-2 text-xs">
                  {item.category === "Miscellaneous" ? "Misc" : item.category}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">No items found matching your filters.</div>
            </CardContent>
          </Card>
        )}

        {/* Bottom Summary */}
        {filteredAndSortedItems.length > 0 && (
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
        )}
      </div>
    </div>
  )
}
