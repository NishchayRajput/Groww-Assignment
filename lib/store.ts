import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WidgetConfig } from '@/components/dashboard'

export interface WidgetStore {
  widgets: WidgetConfig[]
  autoRefreshEnabled: boolean
  refreshInterval: number // in seconds
  selectedFields: Record<string, string[]> // widget id -> selected fields
  addWidget: (widget: WidgetConfig) => void
  removeWidget: (id: string) => void
  updateWidget: (id: string, widget: Partial<WidgetConfig>) => void
  reorderWidgets: (widgets: WidgetConfig[]) => void
  setAutoRefreshEnabled: (enabled: boolean) => void
  setRefreshInterval: (interval: number) => void
  setSelectedFields: (widgetId: string, fields: string[]) => void
  getSelectedFields: (widgetId: string) => string[]
  clearWidgets: () => void
}

export const useWidgetStore = create<WidgetStore>()(
  persist(
    (set, get) => ({
      widgets: [],
      autoRefreshEnabled: true,
      refreshInterval: 60, // 60 seconds default
      selectedFields: {},

      addWidget: (widget: WidgetConfig) => {
        set((state) => ({
          widgets: [...state.widgets, widget],
        }))
      },

      removeWidget: (id: string) => {
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
          selectedFields: Object.fromEntries(
            Object.entries(state.selectedFields).filter(([key]) => key !== id)
          ),
        }))
      },

      updateWidget: (id: string, updates: Partial<WidgetConfig>) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        }))
      },

      reorderWidgets: (widgets: WidgetConfig[]) => {
        set({ widgets })
      },

      setAutoRefreshEnabled: (enabled: boolean) => {
        set({ autoRefreshEnabled: enabled })
      },

      setRefreshInterval: (interval: number) => {
        set({ refreshInterval: Math.max(5, interval) }) // Minimum 5 seconds
      },

      setSelectedFields: (widgetId: string, fields: string[]) => {
        set((state) => ({
          selectedFields: {
            ...state.selectedFields,
            [widgetId]: fields,
          },
        }))
      },

      getSelectedFields: (widgetId: string) => {
        const state = get()
        return state.selectedFields[widgetId] || []
      },

      clearWidgets: () => {
        set({
          widgets: [],
          selectedFields: {},
        })
      },
    }),
    {
      name: 'widget-store', // localStorage key
      version: 1,
    }
  )
)
