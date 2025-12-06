import { useEffect, useRef } from 'react'
import { useWidgetStore } from '@/lib/store'

export function useAutoRefresh(onRefresh: () => void) {
  const { autoRefreshEnabled, refreshInterval } = useWidgetStore()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!autoRefreshEnabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Clear existing interval if any
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Set up new interval
    intervalRef.current = setInterval(() => {
      onRefresh()
    }, refreshInterval * 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoRefreshEnabled, refreshInterval, onRefresh])
}
