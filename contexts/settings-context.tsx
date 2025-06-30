"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AppSettings {
  performanceMonitoring: boolean
  autoSave: boolean
  compactView: boolean
  showValues: boolean
  theme: "light" | "dark" | "system"
}

interface SettingsContextType {
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => void
  resetSettings: () => void
}

const defaultSettings: AppSettings = {
  performanceMonitoring: false,
  autoSave: true,
  compactView: false,
  showValues: true,
  theme: "system",
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)

  useEffect(() => {
    const stored = localStorage.getItem("app-settings")
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) })
      } catch (error) {
        console.warn("Failed to parse stored settings, using defaults")
      }
    }
  }, [])

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates }
      localStorage.setItem("app-settings", JSON.stringify(newSettings))
      return newSettings
    })
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.setItem("app-settings", JSON.stringify(defaultSettings))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
