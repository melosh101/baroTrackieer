"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ItemCard } from "@/components/item-card"
import { calculateTotals, formatNumber } from "@/lib/data-utils"
import { ArrowLeft, Search, Filter, SortAsc, SortDesc, CheckSquare, Square } from "lucide-react"
import { useBaroData } from "@/hooks/useBaroData"
import { useOwnedItems } from "@/hooks/useOwnedItems"
import { useImportExport } from "@/hooks/useImportExport"
import { PageSkeleton } from "@/components/page-skeleton"
import { ViewAllPageSkeleton } from "@/components/view-all-page-skeleton"
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor"
import { ViewAllSummaryCards } from "@/components/view-all-summary-cards"
import { ItemGrid } from "@/components/item-grid"
import { ViewAllBottomSummary } from "@/components/view-all-bottom-summary"
import { ActionButtons } from "@/components/action-buttons"

type SortOption = "name" | "ducats" | "credits" | "category"
type FilterOption = "all" | "owned" | "missing" | "misc" | "appearance" | "mods" | "weapons"

export default function ViewAllPage() {
  const { allItems } = useBaroData()
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
  
  // Performance monitoring (disabled by default)
  usePerformanceMonitor("ViewAllPage", false)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })

  // Memoized filter and sort operations
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

  // Memoized calculations
  const totals = useMemo(() => calculateTotals(allItems, ownedItems), [allItems, ownedItems])
  const visibleTotals = useMemo(() => calculateTotals(filteredAndSortedItems, ownedItems), [filteredAndSortedItems, ownedItems])

  const allVisibleOwned = useMemo(() => 
    filteredAndSortedItems.length > 0 && filteredAndSortedItems.every((item) => ownedItems.has(item.name)),
    [filteredAndSortedItems, ownedItems]
  )

  // Optimized event handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  const handleSortOrderToggle = useCallback(() => {
    setSortOrder(current => current === "asc" ? "desc" : "asc")
  }, [])

  const handlePriceRangeChange = useCallback((field: "min" | "max") => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPriceRange(prev => ({ ...prev, [field]: e.target.value }))
    }, []
  )

  const toggleAllVisible = useCallback(() => {
    const shouldUnmark = filteredAndSortedItems.every((item) => ownedItems.has(item.name))
    toggleAllItems(filteredAndSortedItems, !shouldUnmark)
  }, [filteredAndSortedItems, ownedItems, toggleAllItems])

  const handleGoBack = useCallback(() => {
    window.history.back()
  }, [])

  const handleExport = useCallback(() => {
    exportData(ownedItems)
  }, [exportData, ownedItems])

  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    importData(event, setOwnedFromImport)
  }, [importData, setOwnedFromImport])

  const handleReset = useCallback(() => {
    if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      resetItems()
    }
  }, [resetItems])

  if (!isLoaded) {
    return <ViewAllPageSkeleton />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleGoBack} 
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">All Baro Ki'teer Items</h1>
              <p className="text-muted-foreground">Complete inventory view with advanced filtering</p>
            </div>
          </div>

          <ActionButtons
            onExport={handleExport}
            onImport={handleImport}
            onReset={handleReset}
            isSaving={isSaving}
          />
        </div>

        {/* Summary Cards */}
        <ViewAllSummaryCards totals={totals} />

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
                onChange={handleSearchChange}
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
                  onClick={handleSortOrderToggle}
                  className="w-full justify-start"
                >
                  {sortOrder === "asc" ? (
                    <>
                      <SortAsc className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Ascending</span>
                      <span className="sm:hidden">Asc</span>
                    </>
                  ) : (
                    <>
                      <SortDesc className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Descending</span>
                      <span className="sm:hidden">Desc</span>
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
                      <span className="hidden sm:inline">Unmark All</span>
                      <span className="sm:hidden">Unmark</span>
                    </>
                  ) : (
                    <>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Mark All</span>
                      <span className="sm:hidden">Mark</span>
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
                  onChange={handlePriceRangeChange("min")}
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={priceRange.max}
                  onChange={handlePriceRangeChange("max")}
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
          {isSaving && <Badge variant="secondary">Saving...</Badge>}
          {visibleTotals.owned > 0 && <Badge variant="secondary">{visibleTotals.owned} owned</Badge>}
          {visibleTotals.missing > 0 && <Badge variant="outline">{visibleTotals.missing} missing</Badge>}
          {visibleTotals.missingDucats > 0 && (
            <Badge variant="destructive">{formatNumber(visibleTotals.missingDucats)} ducats needed</Badge>
          )}
        </div>

        {/* Items Grid */}
        <ItemGrid 
          items={filteredAndSortedItems}
          ownedItems={ownedItems}
          onToggleItem={toggleItem}
        />

        {/* Bottom Summary */}
        <ViewAllBottomSummary 
          visibleTotals={visibleTotals}
          showSummary={filteredAndSortedItems.length > 0}
        />
      </div>
    </div>
  )
}
