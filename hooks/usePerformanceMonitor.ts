import { useEffect } from "react"

interface PerformanceMetrics {
  name: string
  duration: number
  timestamp: number
}

export function usePerformanceMonitor(name: string, enabled = false) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return

    const startTime = performance.now()
    const mark = `${name}-start`
    
    performance.mark(mark)

    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Only log if duration is significant (>16ms, one frame)
      if (duration > 16) {
        console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`)
        
        const metric: PerformanceMetrics = {
          name,
          duration,
          timestamp: Date.now()
        }
        
        // Store metrics for potential analytics
        if (window.localStorage) {
          try {
            const existing = localStorage.getItem('perf-metrics')
            const metrics = existing ? JSON.parse(existing) : []
            metrics.push(metric)
            
            // Keep only last 50 metrics
            if (metrics.length > 50) {
              metrics.splice(0, metrics.length - 50)
            }
            
            localStorage.setItem('perf-metrics', JSON.stringify(metrics))
          } catch (error) {
            // Ignore localStorage errors
          }
        }
      }

      try {
        performance.clearMarks(mark)
      } catch (error) {
        // Ignore performance API errors
      }
    }
  }, [name, enabled])
}

export function getPerformanceMetrics(): PerformanceMetrics[] {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem('perf-metrics')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}
