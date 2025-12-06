'use client'

import React from 'react'
import { WidgetConfig } from '@/components/dashboard'
import { ChartWidget } from '@/components/chart-widget'
import { TableWidget } from '@/components/table-widget'
import { CardWidget } from '@/components/card-widget'

interface WidgetRendererProps {
  widget: WidgetConfig
  onRemove: () => void
  onChangeFormat: (format: 'chart' | 'table' | 'card') => void
  onChangeGridSpan?: (span: 1 | 2 | 3) => void
}

export function WidgetRenderer({
  widget,
  onRemove,
  onChangeFormat,
  onChangeGridSpan,
}: WidgetRendererProps) {
  return (
    <>
      {widget.displayFormat === 'chart' && (
        <ChartWidget widget={widget} onRemove={onRemove} onChangeFormat={onChangeFormat} onChangeGridSpan={onChangeGridSpan} />
      )}
      {widget.displayFormat === 'table' && (
        <TableWidget widget={widget} onRemove={onRemove} onChangeFormat={onChangeFormat} onChangeGridSpan={onChangeGridSpan} />
      )}
      {widget.displayFormat === 'card' && (
        <CardWidget widget={widget} onRemove={onRemove} onChangeFormat={onChangeFormat} />
      )}
    </>
  )
}
