"use client"

import { memo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Download, Upload, RotateCcw, List } from "lucide-react"
import AuthButtons from "@/components/AuthButtons"

interface ActionButtonsProps {
  onExport: () => void
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void
  onReset: () => void
  isSaving?: boolean
}

export const ActionButtons = memo(function ActionButtons({
  onExport,
  onImport,
  onReset,
  isSaving = false
}: ActionButtonsProps) {
  const router = useRouter()

  const handleViewAll = () => {
    router.push("/view-all")
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      onReset()
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={handleViewAll}
        className="flex items-center gap-2 bg-transparent"
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline">View All</span>
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onExport} 
        className="flex items-center gap-2 bg-transparent"
        disabled={isSaving}
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Export</span>
      </Button>
      
      <label className="cursor-pointer">
        <Button variant="outline" className="flex items-center gap-2 bg-transparent" asChild>
          <span>
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Import</span>
          </span>
        </Button>
        <input 
          type="file" 
          accept=".json" 
          onChange={onImport} 
          className="hidden" 
        />
      </label>
      
      <Button 
        variant="outline" 
        onClick={handleReset} 
        className="flex items-center gap-2 bg-transparent"
        disabled={isSaving}
      >
        <RotateCcw className="h-4 w-4" />
        <span className="hidden sm:inline">Reset</span>
      </Button>
      
      <AuthButtons />
    </div>
  )
})
