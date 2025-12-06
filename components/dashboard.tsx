'use client'

import React, { useState, useCallback } from 'react'
import { Plus, Moon, Sun, TrendingUp, Wallet, PieChart, Activity, X, RotateCw, Settings2, Trash2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { AddWidgetModal } from '@/components/add-widget-modal'
import { WidgetRenderer } from '@/components/widget-renderer'
import { useWidgetStore } from '@/lib/store'
import { useAutoRefresh } from '@/hooks/use-auto-refresh'

export interface WidgetConfig {
  id: string
  type: 'chart' | 'table' | 'card'
  displayFormat: 'chart' | 'table' | 'card'
  symbol: string
  interval: '1min' | '5min' | '15min' | '30min' | '60min'
  adjusted: boolean
  extended_hours: boolean
  outputsize: 'compact' | 'full'
  month?: string
  order: number
  gridSpan?: 1 | 2 | 3
}

export function Dashboard() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showRefreshIndicator, setShowRefreshIndicator] = useState(false)

  const {
    widgets,
    addWidget: storeAddWidget,
    removeWidget: storeRemoveWidget,
    updateWidget: storeUpdateWidget,
    reorderWidgets: storeReorderWidgets,
    autoRefreshEnabled,
    refreshInterval,
    setAutoRefreshEnabled,
    setRefreshInterval,
    clearWidgets,
  } = useWidgetStore()

  const [widgetsState, setWidgetsState] = useState<WidgetConfig[]>([])
  
  React.useEffect(() => {
    if (widgets.length > widgetsState.length || widgets.length < widgetsState.length) {
      setWidgetsState(widgets)
    }
  }, [widgets])

  const handleAutoRefresh = useCallback(() => {
    setShowRefreshIndicator(true)
    setTimeout(() => setShowRefreshIndicator(false), 1500)
  }, [])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  useAutoRefresh(handleAutoRefresh)

  const handleAddWidget = (config: Omit<WidgetConfig, 'id' | 'order'>) => {
    const newWidget: WidgetConfig = {
      ...config,
      id: `widget-${Date.now()}`,
      order: widgetsState.length,
    }
    storeAddWidget(newWidget)
    setShowModal(false)
  }

  const handleRemoveWidget = (id: string) => {
    storeRemoveWidget(id)
  }

  const handleDragStart = (id: string) => {
    setDraggedWidget(id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetId: string) => {
    if (!draggedWidget || draggedWidget === targetId) {
      setDraggedWidget(null)
      return
    }

    const draggedIndex = widgetsState.findIndex(w => w.id === draggedWidget)
    const targetIndex = widgetsState.findIndex(w => w.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedWidget(null)
      return
    }

    const newWidgets = [...widgetsState]
    const [movedWidget] = newWidgets.splice(draggedIndex, 1)
    newWidgets.splice(targetIndex, 0, movedWidget)

    const updatedWidgets = newWidgets.map((w, idx) => ({ ...w, order: idx }))
    storeReorderWidgets(updatedWidgets)
    setDraggedWidget(null)
  }

  const handleChangeFormat = (id: string, format: 'chart' | 'table' | 'card') => {
    storeUpdateWidget(id, { displayFormat: format })
  }

  const handleChangeGridSpan = (id: string, span: 1 | 2 | 3) => {
    storeUpdateWidget(id, { gridSpan: span })
  }

  const handleRefreshNow = () => {
    handleAutoRefresh()
  }

  const handleClearAllWidgets = () => {
    if (confirm('Are you sure you want to remove all widgets? This action cannot be undone.')) {
      clearWidgets()
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 dark:bg-indigo-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <header className="border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md bg-white/30 dark:bg-slate-900/30 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">₹</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Finance Dashboard
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Your financial overview
                </p>
              </div>
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome back!
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Track your investments and manage your portfolio with ease
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Wallet, label: 'Total Balance', value: '₹2,45,890' },
              { icon: TrendingUp, label: 'Growth (YTD)', value: '+12.5%' },
              { icon: PieChart, label: 'Portfolio Value', value: '₹5,67,340' },
              { icon: Activity, label: 'Last Updated', value: 'Just now' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="group bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800/50 rounded-xl p-4 shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <stat.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add widget button */}
          <div className="mb-8 flex gap-3 flex-wrap items-center">
            <Button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 text-white rounded-lg px-6 py-2.5 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 group"
            >
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Add Widget
            </Button>

            <div className="flex gap-2 items-center flex-wrap">
              {showRefreshIndicator && (
                <div className="text-xs px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium animate-pulse">
                  ✓ Data refreshed
                </div>
              )}

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm">
                <div className={`w-2 h-2 rounded-full ${autoRefreshEnabled ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                <span className="text-slate-700 dark:text-slate-300 text-xs">
                  {autoRefreshEnabled ? `Refresh: ${refreshInterval}s` : 'Auto-refresh: OFF'}
                </span>
              </div>

              <button
                onClick={handleRefreshNow}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400"
                title="Refresh all widgets"
              >
                <RotateCw className={`w-4 h-4 ${showRefreshIndicator ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400"
                title="Dashboard settings"
              >
                <Settings2 className="w-4 h-4" />
              </button>

              {widgetsState.length > 0 && (
                <button
                  onClick={handleClearAllWidgets}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors text-slate-600 dark:text-slate-400"
                  title="Clear all widgets"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {showSettings && (
            <div className="mb-8 p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Dashboard Settings
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <label className="text-sm font-medium text-slate-900 dark:text-white">
                      Auto-refresh Data
                    </label>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Automatically refresh all widgets at intervals
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      autoRefreshEnabled
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white'
                    }`}
                  >
                    {autoRefreshEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                {/* Refresh interval */}
                {autoRefreshEnabled && (
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <label className="text-sm font-medium text-slate-900 dark:text-white block mb-2">
                      Refresh Interval: {refreshInterval} seconds
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="300"
                      step="5"
                      value={refreshInterval}
                      onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mt-2">
                      <span>5s</span>
                      <span>300s (5m)</span>
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-900 dark:text-blue-300">
                    💾 All widget configurations are automatically saved to your browser's local storage and will be restored on next visit.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {widgets
              .sort((a, b) => a.order - b.order)
              .map((widget) => {
                const gridSpanClass = widget.gridSpan === 2 ? 'md:col-span-2 lg:col-span-2' : widget.gridSpan === 3 ? 'md:col-span-2 lg:col-span-3' : ''
                return (
                <div
                  key={widget.id}
                  draggable
                  onDragStart={() => handleDragStart(widget.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(widget.id)}
                  className={`cursor-move transition-opacity h-full ${gridSpanClass} ${
                    draggedWidget === widget.id ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  <WidgetRenderer
                    widget={widget}
                    onRemove={() => handleRemoveWidget(widget.id)}
                    onChangeFormat={(format) => handleChangeFormat(widget.id, format)}
                    onChangeGridSpan={(span) => handleChangeGridSpan(widget.id, span)}
                  />
                </div>
              )}
            )}

            {/* Add widget card */}
            {widgets.length > 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-sm border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-500"
              >
                <div className="flex flex-col items-center justify-center h-full min-h-96">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    Add New Widget
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                    Click to add a new widget
                  </p>
                </div>
              </button>
            )}
          </div>

          {/* Empty state */}
          {widgets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center mb-6">
                <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No widgets yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Start by adding your first stock chart widget
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Add Widget Modal */}
      {showModal && (
        <AddWidgetModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddWidget}
        />
      )}
    </div>
  )
}
