import { useMemo } from "react"
import { parseItemData, type BaroItem } from "@/lib/data-utils"
import miscData from "@/data/misc"
import appearanceData from "@/data/appearance"
import modsData from "@/data/mods"
import weaponsData from "@/data/weapons"

export function useBaroData() {
  const data = useMemo(() => {
    const itemsByCategory = {
      misc: parseItemData([...miscData], "Miscellaneous"),
      appearance: parseItemData([...appearanceData], "Appearance"),
      mods: parseItemData([...modsData], "Mods"),
      weapons: parseItemData([...weaponsData], "Weapons"),
    }

    const allItems = [
      ...itemsByCategory.misc,
      ...itemsByCategory.appearance,
      ...itemsByCategory.mods,
      ...itemsByCategory.weapons,
    ]

    return { itemsByCategory, allItems }
  }, [])

  return data
}
