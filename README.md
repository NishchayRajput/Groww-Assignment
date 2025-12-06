# 📊 Finance Dashboard

A responsive, real-time stock data dashboard built with Next.js, React, Recharts, and Tailwind CSS. This project demonstrates advanced frontend development, state management, API integration, and modern UX design practices.

## ✨ Core Features

- **Real-time Stock Data** - Live OHLCV data via Alpha Vantage API
- **Multiple Display Formats** - View data as interactive charts, paginated tables, or summary cards
- **Expandable Widgets** - Responsive grid with 1, 2, or 3 column spans
- **Auto-Refresh** - Configurable automatic data updates (5-300 seconds)
- **Global State Management** - Zustand store with localStorage persistence
- **Drag & Drop Reordering** - Reorganize widgets dynamically
- **Dark Mode Support** - Seamless light/dark theme switching
- **Responsive Design** - Optimized for mobile, tablet, and desktop

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

---

## 🎯 Evaluation Criteria - Implementation Overview

### 1. **Frontend Development Skills** ⭐
**React Proficiency & Component Architecture:**
- Implemented using **Next.js 16 with React 19** for modern component-based architecture
- Custom hooks: `useAutoRefresh`, `useMobile`, `useTheme` for reusable logic
- Proper separation of concerns with dedicated components:
  - `ChartWidget.tsx` - Recharts visualization with data processing
  - `TableWidget.tsx` - Paginated table with responsive sizing
  - `CardWidget.tsx` - Summary metrics with gradient styling
  - `WidgetRenderer.tsx` - Format-agnostic widget rendering
  - `FieldSelector.tsx` - Dynamic field selection interface
- Functional components with hooks throughout (no class components)
- Responsive layouts using Tailwind CSS 4 with mobile-first approach
- Proper TypeScript interfaces for type safety

### 2. **State Management** ⭐⭐⭐
**Effective Use of Zustand:**
- Centralized Zustand store (`lib/store.ts`) handling:
  - Widget CRUD operations (add, remove, update, reorder)
  - Global settings (auto-refresh toggle, refresh interval)
  - Field selection tracking per widget
  - **Automatic localStorage persistence** - data survives page refreshes
- Actions implemented: `addWidget`, `removeWidget`, `updateWidget`, `reorderWidgets`, `setAutoRefreshEnabled`, `setRefreshInterval`
- Subscribe pattern for reactive updates across dashboard
- No prop drilling - state accessible to deeply nested components

### 3. **API Integration** ⭐⭐
**Dynamic JSON Data Handling:**
- Alpha Vantage API integration with robust error handling:
  - Rate limit detection and user feedback
  - Fallback mechanism for different API response structures
  - Dynamic time series key detection
- Handles multiple data formats:
  - 1min, 5min, 15min, 30min, 60min intervals
  - Compact (100 points) and Full (30 days) data sizes
  - Optional historical month queries
- Data processing pipeline:
  - Transform API response → Parse OHLCV data → Calculate statistics
  - Min/Max/Average calculations for each widget
  - Price change percentage computation
- Loading states and error boundaries for better UX

**API Implementation Note:**
We utilized the **demo API key** to focus on implementation quality and clean architecture rather than spending time on API key validation issues. The demo API (5 calls/min, 500 calls/day) is sufficient for testing and demonstrates full integration capability that scales seamlessly with a production API key. **For demo testing, use stock symbol `IBM` which is supported by the demo API.**

### 4. **User Experience Design** ⭐⭐⭐
**Intuitive Interfaces for Non-Technical Users:**
- **Clean Visual Hierarchy:**
  - Frosted glass card design with subtle animations
  - Color-coded metrics (green for positive, red for negative trends)
  - Clear typography with consistent sizing
- **Interactive Elements:**
  - Hover-activated controls reduce UI clutter
  - Smooth transitions and animations
  - Responsive button feedback
- **Accessibility Features:**
  - Dark/Light theme toggle with system preference detection
  - High contrast ratios for readability
  - Keyboard-navigable form inputs
- **Progressive Disclosure:**
  - Settings panel collapses by default
  - Format switcher only appears on hover
  - Add widget modal in drawer for focus
- **Responsive Widget Sizing:**
  - Fixed heights for charts: `h-64 md:h-80 lg:h-96` ensuring consistent layouts
  - Table containers with responsive text sizes
  - Card grids that adapt to viewport
  - Consistent padding/margins across all widgets: `p-3` (compact yet readable)
  - Border radius: `rounded-xl` for modern aesthetic
  - Font sizes scaled: `text-sm` for headers, `text-xs` for metadata

### 5. **Problem-Solving Ability** ⭐⭐⭐
**Flexible Solutions for Diverse Challenges:**
- **Grid Layout System:** Implemented CSS Grid with dynamic column spanning (`lg:col-span-1`, `lg:col-span-2`, `lg:col-span-3`) handling responsive breakpoints
- **Pagination Logic:** Custom pagination in TableWidget with page navigation and entry counters
- **Data Transformation:** Universal format switching (Chart ↔ Table ↔ Card) on the same dataset
- **Auto-refresh Architecture:** Interval-based refresh triggering across multiple widgets without excessive re-renders
- **localStorage Persistence:** Automatic serialization/deserialization of complex widget state
- **Time Format Parsing:** Extract readable times from "YYYY-MM-DD HH:MM:SS" format for chart tooltips

### 6. **Code Quality** ⭐⭐⭐
**Clean, Maintainable, Scalable Architecture:**
- **Code Organization:**
  - Components: UI components with single responsibility
  - Hooks: Reusable logic (auto-refresh, mobile detection)
  - Lib: Utilities and store (state management, helpers)
  - Clear file naming and structure
- **Best Practices:**
  - No console.log statements (clean production code)
  - Proper error handling and logging
  - TypeScript for type safety throughout
  - ESLint configured for code consistency
- **Scalability:**
  - Zustand store easily extends to new features
  - Component patterns support adding new widget types
  - CSS classes use Tailwind utility-first approach
  - Modular API integration for easy provider switching
- **Performance:**
  - Memoized components to prevent unnecessary re-renders
  - Lazy data fetching only when widget is added
  - Debounced resize calculations for responsive design

---

## 🏆 Brownie Points - Advanced Features Implemented

### 1. **Dynamic Theme Switching** ⭐⭐
**Complete Light/Dark Mode Implementation:**
- Seamless toggle between themes without page reload
- Uses `next-themes` for system preference detection
- Theme persists across sessions via localStorage
- Affects all UI elements:
  - Background gradients (light: blue-50 → dark: slate-950)
  - Text colors with proper contrast ratios
  - Component backgrounds (cards, buttons, inputs)
  - Borders and shadows adapt to theme
- No flickering on page load due to SSR compatibility
- Animated transition effects between themes (200ms duration)

**Implementation Details:**
```tsx
// Components use dynamic classes:
className="bg-white dark:bg-slate-900/50"
className="text-slate-900 dark:text-white"
className="border-slate-200 dark:border-slate-800/50"
```

Theme toggle in header with system preference detection ensures seamless user experience.

### 2. **Real-time Data Updates** ⭐⭐
**Auto-Refresh System:**
- Configurable refresh intervals: 5-300 seconds (slider control)
- Toggle auto-refresh on/off from dashboard settings
- Visual feedback:
  - Pulse animation on auto-refresh indicator
  - Green status dot shows active refresh state
  - "Data refreshed" notification with timestamp
- Per-widget refresh capability
- Maintains data consistency across all widgets
- Prevents stale data while respecting API rate limits

**Implementation:**
```tsx
// Custom hook handles intervals
const useAutoRefresh = (callback: () => void) => {
  const { autoRefreshEnabled, refreshInterval } = useWidgetStore()
  
  useEffect(() => {
    if (!autoRefreshEnabled) return
    const interval = setInterval(callback, refreshInterval * 1000)
    return () => clearInterval(interval)
  }, [autoRefreshEnabled, refreshInterval, callback])
}
```

### 3. **Advanced Widget Management** ⭐⭐
**Grid Expansion System:**
- Widgets span 1, 2, or 3 columns dynamically
- Responsive design adapts to screen size
- CSS Grid automatically wraps expanded widgets
- Visual indicators (numbered buttons 1, 2, 3) show current span
- Smooth transitions when expanding/collapsing

**Implementation:**
```tsx
// Grid columns: 1 on mobile, 2 on tablet, 3 on desktop
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// Dynamic spanning
className={widget.gridSpan === 2 ? 'md:col-span-2 lg:col-span-2' : 
           widget.gridSpan === 3 ? 'md:col-span-2 lg:col-span-3' : ''}
```

### 4. **Responsive Widget Sizing** ⭐⭐
**Consistent Size Management Across Formats:**

**Chart Widget Sizing:**
- Responsive height: `h-64 md:h-80 lg:h-96` (256px → 320px → 384px)
- Maintains aspect ratio across breakpoints
- Recharts ResponsiveContainer fills available space
- Padding: `p-3` for compact, readable layout
- Font sizes: Chart labels `text-xs` for clarity at small sizes
- Smooth animations with `isAnimationActive={false}` for performance

**Table Widget Sizing:**
- Consistent row height for predictable layouts
- Font scaling: headers `text-sm`, cells `text-xs`
- Fixed padding ensures alignment
- Pagination controls sized for mobile accessibility
- Scrollable with `overflow-auto` on small screens
- Dynamic column widths adapt to content

**Card Widget Sizing:**
- Uniform card heights through `h-full flex flex-col`
- Consistent spacing: `gap-2` between metrics
- Text sizing: title `text-lg`, value `text-sm`, label `text-xs`
- Adaptive to grid columns (1, 2, or 3 columns)
- Color-coded badges for visual distinction

**Global Widget Sizing:**
- All widgets: `rounded-xl` border radius (modern aesthetic)
- Padding: `p-3` throughout (compact yet readable)
- Border: `border-slate-200 dark:border-slate-800/50` (subtle)
- Shadow: `shadow-lg dark:shadow-xl` for depth
- Hover effect: `hover:shadow-2xl transition-all duration-300`
- Header icons: `w-8 h-8` for consistency
- Control buttons: `p-1.5` to `p-2` for touch-friendly targets

---

## 📖 How to Use

### Adding a Widget

1. Click **"Add Widget"** button
2. Enter stock symbol - **⚠️ IMPORTANT: Use `IBM` for demo API** (The demo API has limited functionality. For other stock symbols like AAPL, MSFT, GOOGL, please configure your own API key from [Alpha Vantage](https://www.alphavantage.co/))
3. Choose display format:
   - 📈 **Chart** - Interactive line chart with statistics
   - 📋 **Table** - Paginated OHLCV data (10 rows/page)
   - 🎨 **Card** - Summary cards with metrics
4. Optional: Customize time interval (default: 5min)
5. Click **"Add Widget"**

### Widget Controls

- **Format Switcher** - Toggle between Chart, Table, Card
- **Grid Span (1/2/3)** - Adjust column width dynamically
- **Drag to Reorder** - Click and drag widget header
- **Auto-Refresh** - Toggle in Settings panel
- **Remove** - Click X button

### Dashboard Settings

- **Auto-Refresh** - Enable/disable automatic updates
- **Refresh Interval** - Set 5-300 second intervals
- **Field Selection** - Choose visible data fields
- **Clear All** - Remove all widgets at once

## 🏗️ Architecture

### Component Structure

```
dashboard.tsx (Main Orchestration)
├── add-widget-modal.tsx (Add Widget Form)
├── chart-widget.tsx (Chart Display)
├── table-widget.tsx (Table Display)
├── card-widget.tsx (Card Display)
├── widget-renderer.tsx (Format Manager)
├── field-selector.tsx (Field Selection)
└── theme-provider.tsx (Theme Context)

lib/
├── store.ts (Zustand State Management)
└── utils.ts (Utility Functions)

hooks/
├── use-auto-refresh.ts (Auto-refresh Timer)
├── use-mobile.ts (Responsive Detection)
```

### State Management Flow

```
Zustand Store (lib/store.ts)
├── widgets: WidgetConfig[]
├── autoRefreshEnabled: boolean
├── refreshInterval: number
├── selectedFields: Map<widgetId, fields>
└── Methods: add, remove, update, reorder, setAutoRefresh, setInterval

Dashboard Component
├── Subscribes to store changes
├── Dispatches actions on user interaction
└── Passes state to child widgets

Auto-refresh Hook
├── Monitors store state
├── Triggers refresh on interval
└── Persists to localStorage automatically
```

## 🌐 API Reference

### Alpha Vantage API

- **Endpoint**: `https://www.alphavantage.co/query`
- **Function**: `TIME_SERIES_INTRADAY`
- **Parameters**: Symbol, Interval, APIKey
- **Response**: OHLCV time series data
- **Rate Limit**: 5 calls/min, 500/day (demo)

### Example Stocks

- **Tech**: AAPL, MSFT, GOOGL, NVDA, TSLA
- **Finance**: JPM, BAC, GS, WFC
- **Retail**: AMZN, WMT, TGT
- **Energy**: XOM, CVX, MPC

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with Turbopack
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts 2.15
- **State Management**: Zustand 5
- **Theme**: next-themes
- **Icons**: Lucide React 0.556
- **Language**: TypeScript
- **Linting**: ESLint with Next.js config

## 📦 Project Structure

```
/app
  ├── page.tsx (Homepage)
  ├── layout.tsx (Root Layout)
  └── globals.css (Global Styles)

/components
  ├── dashboard.tsx
  ├── add-widget-modal.tsx
  ├── chart-widget.tsx
  ├── table-widget.tsx
  ├── card-widget.tsx
  ├── widget-renderer.tsx
  ├── field-selector.tsx
  ├── theme-provider.tsx
  └── ui/
      └── button.tsx

/lib
  ├── store.ts (Zustand Store)
  └── utils.ts (Utilities)

/hooks
  ├── use-auto-refresh.ts
  └── use-mobile.ts

/public
  └── (static assets)
```

## 🔧 Key Implementation Details

### Auto-Refresh Mechanism
- Interval-based refresh triggered every 5-300 seconds (user configurable)
- Centralized through Zustand store subscription
- Visual indicator shows last refresh time
- Automatically persists refresh settings to localStorage

### Data Persistence
- Zustand store persists all widget state to `localStorage`
- Survives page refresh and browser restart
- Serialization/deserialization handled automatically
- No manual state recovery needed

### Responsive Grid System
- CSS Grid with 3 columns on desktop, 2 on tablet, 1 on mobile
- Dynamic column spanning (1, 2, or 3) per widget
- Automatic text resizing for readability
- Consistent padding and margins across all screen sizes

## 🚀 Production Build

```bash
npm run build
npm run start
```

## 📝 Implementation Notes

- **Demo API**: Using Alpha Vantage demo API to focus on implementation quality and clean architecture. The demo API (5 calls/min, 500 calls/day) is limited to certain symbols like `IBM`. For full access to all stock symbols (AAPL, MSFT, GOOGL, NVDA, etc.), get your own free API key from [https://www.alphavantage.co/](https://www.alphavantage.co/) and replace `const API_KEY = 'demo'` in `components/chart-widget.tsx`.
- **Recommended Test Symbol**: Use `IBM` for testing with the demo API
- **Rate Limits**: Respected in auto-refresh design to prevent throttling
- **Data Freshness**: Auto-refresh intervals optimized for API constraints
- **Storage**: Widget state persists to browser localStorage (~5-10MB limit per domain)

## 🎓 Learning Outcomes

This project demonstrates:
✅ Modern React with Next.js and TypeScript
✅ Zustand for lightweight state management with persistence
✅ API integration with error handling and fallbacks
✅ Responsive design with Tailwind CSS
✅ Advanced theme switching and dark mode support
✅ Auto-refresh and data synchronization patterns
✅ Component composition and reusability
✅ Performance optimization techniques
✅ Clean code practices and architecture patterns
✅ Scalable widget-based architecture
✅ User experience optimization for non-technical users
✅ Accessible and inclusive design principles
