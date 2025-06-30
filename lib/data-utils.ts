export interface BaroItem {
  name: string
  ducat: string
  credit: string
  ducatValue: number
  creditValue: number
  category: string
}

export function parseItemData(items: any[], category: string): BaroItem[] {
  return items.map((item) => ({
    ...item,
    category,
    ducatValue: Number.parseInt(item.ducat.replace(/[^\d]/g, "")) || 0,
    creditValue: Number.parseInt(item.credit.replace(/[^\d]/g, "")) || 0,
  }))
}

export function formatNumber(num: number): string {
  return num.toLocaleString()
}

export function calculateTotals(items: BaroItem[], ownedItems: Set<string>) {
  const owned = items.filter((item) => ownedItems.has(item.name))
  const missing = items.filter((item) => !ownedItems.has(item.name))

  return {
    total: items.length,
    owned: owned.length,
    missing: missing.length,
    ownedDucats: owned.reduce((sum, item) => sum + item.ducatValue, 0),
    ownedCredits: owned.reduce((sum, item) => sum + item.creditValue, 0),
    missingDucats: missing.reduce((sum, item) => sum + item.ducatValue, 0),
    missingCredits: missing.reduce((sum, item) => sum + item.creditValue, 0),
  }
}
