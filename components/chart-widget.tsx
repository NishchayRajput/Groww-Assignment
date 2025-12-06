'use client'

import React, { useEffect, useState } from 'react'
import { X, TrendingUp, TrendingDown, Loader2, BarChart3, Table2, LayoutGrid, Maximize2, Maximize, Copy } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { WidgetConfig } from '@/components/dashboard'

interface ChartWidgetProps {
  widget: WidgetConfig
  onRemove: () => void
  onChangeFormat: (format: 'chart' | 'table' | 'card') => void
  onChangeGridSpan?: (span: 1 | 2 | 3) => void
}

interface ChartData {
  time: string
  close: number
  high?: number
  low?: number
}

const API_KEY = 'demo'

export function ChartWidget({ widget, onRemove, onChangeFormat, onChangeGridSpan }: ChartWidgetProps) {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<{
    current: number
    high: number
    low: number
    change: number
    changePercent: number
  } | null>(null)

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
          setError('No time series data available for this symbol. The demo API may have limited calls.')
          return
        }

        const timeSeries = jsonData[timeSeriesKey]
        const entries = Object.entries(timeSeries)

        if (entries.length === 0) {
          setError('No data points available')
          return
        }

        const chartData: ChartData[] = entries
          .map(([time, candle]: any) => ({
            time,
            close: parseFloat(candle['4. close']),
            high: parseFloat(candle['2. high']),
            low: parseFloat(candle['3. low']),
          }))
          .reverse()
          .slice(-100)

        setData(chartData)

        if (chartData.length > 0) {
          const closes = chartData.map((d) => d.close)
          const highs = chartData.map((d) => d.high || d.close)
          const lows = chartData.map((d) => d.low || d.close)
          const current = closes[closes.length - 1]
          const previous = closes[0]
          const change = current - previous
          const changePercent = (change / previous) * 100

          setStats({
            current,
            high: Math.max(...highs),
            low: Math.min(...lows),
            change,
            changePercent,
          })
        }
      } catch (err) {
        setError('Failed to fetch data. Please check your connection.')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [widget])

  const isPositive = stats && stats.change >= 0

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
         
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            {[1, 2, 3].map((span) => (
              <button
                key={span}
                onClick={() => onChangeGridSpan?.(span as 1 | 2 | 3)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  widget.gridSpan === span
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
                title={`Expand to ${span} column${span > 1 ? 's' : ''}`}
              >
                {span}
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

     
      {stats && !loading && (
        <div className="grid grid-cols-2 gap-1 mb-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Current</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              ₹{stats.current.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Change</p>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <p className={`text-xs font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {stats.change >= 0 ? '+' : ''}{stats.changePercent.toFixed(2)}%
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">High</p>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              ₹{stats.high.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Low</p>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              ₹{stats.low.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-lg overflow-hidden min-h-0 h-64 md:h-80 lg:h-96">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <p className="text-sm text-slate-600 dark:text-slate-400">Loading chart...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Error</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{error}</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                Note: Demo API has limited calls. Use your own API key for production.
              </p>
            </div>
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis
                dataKey="time"
                stroke="#94a3b8"
                style={{ fontSize: '11px' }}
                tick={{ fill: '#64748b' }}
                interval={Math.floor(data.length / 6)}
                tickFormatter={(time) => {
                  if (typeof time === 'string') {
                    const parts = time.split(' ')
                    return parts[1] ? parts[1].slice(0, 5) : time
                  }
                  return time
                }}
              />
              <YAxis
                stroke="#94a3b8"
                style={{ fontSize: '11px' }}
                tick={{ fill: '#64748b' }}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#1e293b',
                }}
                labelStyle={{ color: '#1e293b' }}
                formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
                labelFormatter={(label) => {
                  if (typeof label === 'string') {
                    const parts = label.split(' ')
                    return `${parts[0]} ${parts[1]}`
                  }
                  return label
                }}
              />
              <Line
                type="monotone"
                dataKey="close"
                stroke="#3b82f6"
                dot={false}
                strokeWidth={2}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-slate-600 dark:text-slate-400">No data available</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-slate-500 dark:text-slate-500">
        <p>Data from Alpha Vantage • Last updated just now</p>
      </div>
    </div>
  )
}
