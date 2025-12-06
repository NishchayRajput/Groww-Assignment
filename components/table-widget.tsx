'use client'

import React, { useEffect, useState } from 'react'
import { X, TrendingUp, TrendingDown, Loader2, BarChart3, Table2, LayoutGrid, ChevronLeft, ChevronRight, Maximize2, Maximize } from 'lucide-react'
import { WidgetConfig } from '@/components/dashboard'

interface TableWidgetProps {
  widget: WidgetConfig
  onRemove: () => void
  onChangeFormat: (format: 'chart' | 'table' | 'card') => void
  onChangeGridSpan?: (span: 1 | 2 | 3) => void
}

interface TableData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

const API_KEY = 'demo'
const ROWS_PER_PAGE = 10

export function TableWidget({ widget, onRemove, onChangeFormat, onChangeGridSpan }: TableWidgetProps) {
  const [data, setData] = useState<TableData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

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
        const tableData: TableData[] = Object.entries(timeSeries)
          .map(([time, candle]: any) => ({
            time,
            open: parseFloat(candle['1. open']),
            high: parseFloat(candle['2. high']),
            low: parseFloat(candle['3. low']),
            close: parseFloat(candle['4. close']),
            volume: parseInt(candle['5. volume']),
          }))
          .reverse()

        setData(tableData)
        setCurrentPage(1)
      } catch (err) {
        setError('Failed to fetch data. Please check your connection.')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [widget])

  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE)
  const startIdx = (currentPage - 1) * ROWS_PER_PAGE
  const endIdx = startIdx + ROWS_PER_PAGE
  const paginatedData = data.slice(startIdx, endIdx)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

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
        ) : data.length > 0 ? (
          <>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-2 py-1 font-semibold text-slate-900 dark:text-white">Time</th>
                  <th className="text-right px-2 py-1 font-semibold text-slate-900 dark:text-white">Open</th>
                  <th className="text-right px-2 py-1 font-semibold text-slate-900 dark:text-white">High</th>
                  <th className="text-right px-2 py-1 font-semibold text-slate-900 dark:text-white">Low</th>
                  <th className="text-right px-2 py-1 font-semibold text-slate-900 dark:text-white">Close</th>
                  <th className="text-right px-2 py-1 font-semibold text-slate-900 dark:text-white">Vol</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-2 py-1 text-slate-600 dark:text-slate-300 text-xs">
                      {row.time.split(' ')[1]?.slice(0, 5) || row.time}
                    </td>
                    <td className="text-right px-2 py-1 text-slate-900 dark:text-white text-xs">
                      {row.open.toFixed(1)}
                    </td>
                    <td className="text-right px-2 py-1 text-slate-900 dark:text-white text-xs">
                      {row.high.toFixed(1)}
                    </td>
                    <td className="text-right px-2 py-1 text-slate-900 dark:text-white text-xs">
                      {row.low.toFixed(1)}
                    </td>
                    <td className="text-right px-2 py-1 font-semibold text-slate-900 dark:text-white text-xs">
                      {row.close.toFixed(1)}
                    </td>
                    <td className="text-right px-2 py-1 text-slate-600 dark:text-slate-400 text-xs">
                      {(row.volume / 1000000).toFixed(1)}M
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-2 flex items-center justify-between px-2 py-1">
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {startIdx + 1}-{Math.min(endIdx, data.length)} of {data.length}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Previous page"
                >
                  <ChevronLeft className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                </button>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 min-w-[30px] text-center">
                  {currentPage}/{totalPages || 1}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Next page"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-xs text-slate-600 dark:text-slate-400">No data available</p>
          </div>
        )}
      </div>
    </div>
  )
}
