import { useState, useEffect, useCallback } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { type BaroItem } from "@/lib/data-utils"

const STORAGE_KEY = "baro-owned-items"

export function useOwnedItems() {
  const [ownedItems, setOwnedItems] = useState<Set<string>>(new Set())
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const currentUser = useQuery(api.userFunctions.currentUser)
  const mutateSaveState = useMutation(api.userFunctions.setUserSaveState)
  const userSaveState = useQuery(api.userFunctions.getUserSaveState)

  // Load owned items from localStorage or Convex
  useEffect(() => {
    if (currentUser === undefined) return // Still loading user state
    
    if (!currentUser) {
      // User not logged in, use localStorage
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          setOwnedItems(new Set(JSON.parse(saved)))
        } catch (error) {
          console.error("Error parsing localStorage data:", error)
        }
      }
      setIsLoaded(true)
    } else {
      // User logged in, use Convex data
      if (userSaveState !== undefined) {
        setOwnedItems(new Set(userSaveState || []))
        setIsLoaded(true)
      }
    }
  }, [currentUser, userSaveState])

  // Save to localStorage and Convex when ownedItems changes
  useEffect(() => {
    if (!isLoaded) return

    const saveData = async () => {
      const itemsArray = [...ownedItems]
      
      // Always save to localStorage for backup
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itemsArray))

      if (currentUser) {
        setIsSaving(true)
        try {
          await mutateSaveState({ ownedItems: itemsArray })
        } catch (error) {
          console.error("Failed to save to server:", error)
          // Could add toast notification here
        } finally {
          setIsSaving(false)
        }
      }
    }

    // Debounce saves to avoid too many API calls
    const timeoutId = setTimeout(saveData, 300)
    return () => clearTimeout(timeoutId)
  }, [ownedItems, isLoaded, currentUser, mutateSaveState])

  const toggleItem = useCallback((itemName: string) => {
    setOwnedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemName)) {
        newSet.delete(itemName)
      } else {
        newSet.add(itemName)
      }
      return newSet
    })
  }, [])

  const toggleAllItems = useCallback((items: BaroItem[], owned: boolean) => {
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
  }, [])

  const setOwnedFromImport = useCallback((items: string[]) => {
    setOwnedItems(new Set(items))
  }, [])

  const resetItems = useCallback(() => {
    setOwnedItems(new Set())
  }, [])

  return {
    ownedItems,
    isLoaded,
    isSaving,
    toggleItem,
    toggleAllItems,
    setOwnedFromImport,
    resetItems,
  }
}
