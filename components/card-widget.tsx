'use client'

import React, { useEffect, useState } from 'react'
import { X, TrendingUp, TrendingDown, Loader2, BarChart3, Table2, LayoutGrid } from 'lucide-react'
import { WidgetConfig } from '@/components/dashboard'

interface CardWidgetProps {
  widget: WidgetConfig
  onRemove: () => void
  onChangeFormat: (format: 'chart' | 'table' | 'card') => void
}

interface CardData {
  current: number
  high: number
  low: number
  change: number
  changePercent: number
  volume: number
}

const API_KEY = 'demo'

export function CardWidget({ widget, onRemove, onChangeFormat }: CardWidgetProps) {
  const [data, setData] = useState<CardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams({
          function: 'TIME_SERIES_INTRADAY',
          symbol: widget.symbol,
          interval: widget.interval,
          apikey: API_KEY,
        })

        if (widget.month) {
          params.append('month', widget.month)
        }

        const response = await fetch(
          `https://www.alphavantage.co/query?${params.toString()}`
        )
        const jsonData = await response.json()

        if (jsonData['Error Message']) {
          setError(jsonData['Error Message'])
          return
        }

        if (jsonData['Note']) {
          setError('API rate limit reached. Please try again in a minute.')
          return
        }

        let timeSeriesKey = `Time Series (${widget.interval})`
        if (!jsonData[timeSeriesKey]) {
          timeSeriesKey = Object.keys(jsonData).find(
            (key) => key.startsWith('Time Series') || key.includes('INTRADAY')
          ) || ''
        }

        if (!timeSeriesKey || !jsonData[timeSeriesKey]) {
          setError('No time series data available for this symbol')
          return
        }

        const timeSeries = jsonData[timeSeriesKey]
        const entries = Object.entries(timeSeries)

        if (entries.length === 0) {
          setError('No data points available')
          return
        }

        const latestEntry = entries[0][1] as any
        const closes = entries.map(([_, candle]: any) => parseFloat(candle['4. close']))
        const highs = entries.map(([_, candle]: any) => parseFloat(candle['2. high']))
        const lows = entries.map(([_, candle]: any) => parseFloat(candle['3. low']))

        const current = closes[0]
        const previous = closes[closes.length - 1]
        const change = current - previous
        const changePercent = (change / previous) * 100

        setData({
          current,
          high: Math.max(...highs),
          low: Math.min(...lows),
          change,
          changePercent,
          volume: parseInt(latestEntry['5. volume']),
        })
      } catch (err) {
        setError('Failed to fetch data. Please check your connection.')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [widget])

  const isPositive = data && data.change >= 0

  return (
    <div className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800/50 rounded-xl p-3 shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
      
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-2 flex-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {widget.symbol}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {widget.interval}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            {[
              { format: 'chart', icon: BarChart3 },
              { format: 'table', icon: Table2 },
              { format: 'card', icon: LayoutGrid },
            ].map(({ format, icon: Icon }) => (
              <button
                key={format}
                onClick={() => onChangeFormat(format as 'chart' | 'table' | 'card')}
                className={`p-1.5 rounded transition-all ${
                  widget.displayFormat === format
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
                title={`Switch to ${format}`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
          <button
            onClick={onRemove}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Remove widget"
          >
            <X className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          </button>
        </div>
      </div>

      
      <div className="flex-1 overflow-auto min-h-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <p className="text-sm text-slate-600 dark:text-slate-400">Loading data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Error</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{error}</p>
            </div>
          </div>
        ) : data ? (
          <div className="grid grid-cols-2 gap-2">
         
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Current</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              ₹{data.current.toFixed(1)}
            </p>
          </div>

         
          <div
            className={`rounded-lg p-2 border ${
              isPositive
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800'
                : 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800'
            }`}
          >
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Change</p>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className={`w-4 h-4 text-green-500`} />
              ) : (
                <TrendingDown className={`w-4 h-4 text-red-500`} />
              )}
              <p
                className={`text-lg font-bold ${
                  isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {data.changePercent.toFixed(1)}%
              </p>
            </div>
          </div>

          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-2 border border-purple-200 dark:border-purple-800">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">High</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              ₹{data.high.toFixed(1)}
            </p>
          </div>

         
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg p-2 border border-orange-200 dark:border-orange-800">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Low</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              ₹{data.low.toFixed(1)}
            </p>
          </div>

          
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg p-2 border border-cyan-200 dark:border-cyan-800 col-span-2">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Volume</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {(data.volume / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-slate-600 dark:text-slate-400">No data available</p>
        </div>
      )}
      </div>
    </div>
  )
}
