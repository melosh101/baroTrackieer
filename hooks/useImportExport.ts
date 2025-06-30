import { useCallback } from "react"

interface ExportData {
  ownedItems: string[]
  exportDate: string
}

export function useImportExport() {
  const exportData = useCallback((ownedItems: Set<string>) => {
    const data: ExportData = {
      ownedItems: [...ownedItems],
      exportDate: new Date().toISOString(),
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: "application/json" 
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `baro-inventory-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const importData = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
    onImport: (items: string[]) => void
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as ExportData
        if (data.ownedItems && Array.isArray(data.ownedItems)) {
          onImport(data.ownedItems)
        } else {
          throw new Error("Invalid data format")
        }
      } catch (error) {
        console.error("Import error:", error)
        alert("Invalid file format. Please select a valid Baro inventory JSON file.")
      }
    }
    reader.readAsText(file)
    
    // Reset the input so the same file can be imported again
    event.target.value = ""
  }, [])

  return { exportData, importData }
}
