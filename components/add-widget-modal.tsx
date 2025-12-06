'use client'

import React, { useState } from 'react'
import { X, BarChart3, Table2, LayoutGrid } from 'lucide-react'
import { WidgetConfig } from '@/components/dashboard'

interface AddWidgetModalProps {
  onClose: () => void
  onAdd: (config: Omit<WidgetConfig, 'id' | 'order'>) => void
}

export function AddWidgetModal({ onClose, onAdd }: AddWidgetModalProps) {
  const [symbol, setSymbol] = useState('')
  const [interval, setInterval] = useState<'5min' | '1min' | '15min' | '30min' | '60min'>('5min')
  const [adjusted, setAdjusted] = useState(true)
  const [extended_hours, setExtended_hours] = useState(true)
  const [outputsize, setOutputsize] = useState<'compact' | 'full'>('compact')
  const [month, setMonth] = useState('')
  const [displayFormat, setDisplayFormat] = useState<'chart' | 'table' | 'card'>('chart')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!symbol.trim()) {
      setError('Symbol is required')
      return
    }

    setError('')
    onAdd({
      type: 'chart',
      displayFormat,
      symbol: symbol.toUpperCase(),
      interval,
      adjusted,
      extended_hours,
      outputsize,
      month: month || undefined,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Add Stock Chart Widget
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

         
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Stock Symbol <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="e.g., IBM, AAPL, GOOGL"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter the ticker symbol of the stock you want to track
            </p>
          </div>

          {/* Interval Select */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Time Interval
            </label>
            <select
              value={interval}
              onChange={(e) => setInterval(e.target.value as '1min' | '5min' | '15min' | '30min' | '60min')}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1min">1 Minute</option>
              <option value="5min">5 Minutes</option>
              <option value="15min">15 Minutes</option>
              <option value="30min">30 Minutes</option>
              <option value="60min">60 Minutes (1 Hour)</option>
            </select>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              How frequently to update the data points
            </p>
          </div>

          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Data Size
            </label>
            <select
              value={outputsize}
              onChange={(e) => setOutputsize(e.target.value as 'compact' | 'full')}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="compact">Compact (Last 100 data points)</option>
              <option value="full">Full (Last 30 days)</option>
            </select>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Compact is faster, Full has more historical data
            </p>
          </div>

          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Display Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'chart', label: 'Chart', icon: BarChart3 },
                { value: 'table', label: 'Table', icon: Table2 },
                { value: 'card', label: 'Card', icon: LayoutGrid },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDisplayFormat(value as 'chart' | 'table' | 'card')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    displayFormat === value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Choose how you want to display your stock data
            </p>
          </div>

          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Month (Optional)
            </label>
            <input
              type="text"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="YYYY-MM (e.g., 2024-01)"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Leave empty for recent data, or specify a past month
            </p>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={adjusted}
                onChange={(e) => setAdjusted(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Adjusted for splits & dividends
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={extended_hours}
                onChange={(e) => setExtended_hours(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Include extended hours
              </span>
            </label>
          </div>

          
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-all font-medium"
            >
              Add Widget
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
