'use client'

import React, { useState } from 'react'
import { X, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FieldSelectorProps {
  availableFields: string[]
  selectedFields: string[]
  onFieldsChange: (fields: string[]) => void
  title?: string
}

export function FieldSelector({
  availableFields,
  selectedFields,
  onFieldsChange,
  title = 'Select Fields',
}: FieldSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleField = (field: string) => {
    if (selectedFields.includes(field)) {
      onFieldsChange(selectedFields.filter((f) => f !== field))
    } else {
      onFieldsChange([...selectedFields, field])
    }
  }

  const selectAll = () => {
    onFieldsChange(availableFields)
  }

  const clearAll = () => {
    onFieldsChange([])
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        title="Select fields"
      >
        <Filter className="w-4 h-4" />
        <span>Fields</span>
        {selectedFields.length > 0 && (
          <span className="ml-1 text-xs font-semibold bg-blue-500 text-white rounded-full px-2">
            {selectedFields.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
              {title}
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className="p-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={selectAll}
              className="flex-1 text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors font-medium"
            >
              All
            </button>
            <button
              onClick={clearAll}
              className="flex-1 text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              Clear
            </button>
          </div>

          {/* Field list */}
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {availableFields.length > 0 ? (
              availableFields.map((field) => (
                <label
                  key={field}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field)}
                    onChange={() => toggleField(field)}
                    className="w-4 h-4 rounded cursor-pointer accent-blue-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                    {field}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 p-2">
                No fields available
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {selectedFields.length} of {availableFields.length} selected
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
