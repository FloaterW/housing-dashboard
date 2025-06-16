// Design System Constants for Housing Dashboard
// Ensures consistency across all components

export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },
  accent: {
    50: '#fef3c7',
    100: '#fde68a',
    200: '#fcd34d',
    300: '#fbbf24',
    400: '#f59e0b',
    500: '#d97706',
    600: '#b45309',
    700: '#92400e',
    800: '#78350f',
    900: '#451a03'
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  },
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b'
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  }
};

export const gradients = {
  primary: 'from-blue-500 to-blue-600',
  primaryLight: 'from-blue-400 to-blue-500',
  primaryDark: 'from-blue-600 to-blue-700',
  secondary: 'from-green-500 to-green-600',
  accent: 'from-amber-500 to-orange-500',
  danger: 'from-red-500 to-red-600',
  warning: 'from-yellow-500 to-orange-500',
  success: 'from-green-500 to-emerald-600',
  
  // Card gradients
  cardPrimary: 'from-blue-50 to-blue-100',
  cardSecondary: 'from-green-50 to-green-100',
  cardAccent: 'from-amber-50 to-orange-100',
  cardDanger: 'from-red-50 to-red-100',
  cardWarning: 'from-yellow-50 to-orange-100',
  cardSuccess: 'from-green-50 to-emerald-100',
  
  // Special gradients
  header: 'from-blue-600 via-purple-600 to-indigo-600',
  dashboard: 'from-gray-50 to-gray-100'
};

export const typography = {
  // Headings
  h1: 'text-4xl font-bold text-gray-900',
  h2: 'text-2xl font-bold text-gray-900',
  h3: 'text-xl font-semibold text-gray-800',
  h4: 'text-lg font-semibold text-gray-800',
  h5: 'text-base font-semibold text-gray-700',
  
  // Body text
  body: 'text-base text-gray-600',
  bodyLarge: 'text-lg text-gray-600',
  bodySmall: 'text-sm text-gray-600',
  caption: 'text-xs text-gray-500',
  
  // Special text
  subtitle: 'text-lg text-gray-600',
  label: 'text-sm font-medium text-gray-700',
  
  // Interactive text
  link: 'text-blue-600 hover:text-blue-800',
  buttonText: 'font-medium',
  
  // Status text
  success: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600',
  muted: 'text-gray-500'
};

export const spacing = {
  // Container spacing
  container: 'p-6',
  containerLarge: 'p-8',
  containerSmall: 'p-4',
  
  // Section spacing
  sectionGap: 'space-y-8',
  sectionGapSmall: 'space-y-6',
  sectionGapLarge: 'space-y-10',
  
  // Component spacing
  componentGap: 'space-y-4',
  componentGapSmall: 'space-y-2',
  componentGapLarge: 'space-y-6',
  
  // Grid gaps
  gridGap: 'gap-6',
  gridGapSmall: 'gap-4',
  gridGapLarge: 'gap-8'
};

export const borders = {
  radius: {
    small: 'rounded-lg',
    medium: 'rounded-xl',
    large: 'rounded-2xl',
    full: 'rounded-full'
  },
  
  width: {
    thin: 'border',
    medium: 'border-2',
    thick: 'border-4'
  },
  
  accent: {
    left: 'border-l-4',
    top: 'border-t-4',
    right: 'border-r-4',
    bottom: 'border-b-4'
  }
};

export const shadows = {
  small: 'shadow-sm',
  medium: 'shadow-lg',
  large: 'shadow-xl',
  card: 'shadow-lg hover:shadow-xl',
  button: 'shadow-md hover:shadow-lg'
};

export const animations = {
  transition: 'transition-all duration-300',
  transitionFast: 'transition-all duration-200',
  transitionSlow: 'transition-all duration-500',
  
  // Hover effects
  hoverScale: 'hover:scale-105',
  hoverScaleSmall: 'hover:scale-102',
  
  // Loading
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce'
};

export const layout = {
  // Grid layouts
  gridAuto: 'grid grid-cols-1',
  gridResponsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  gridResponsive4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  gridResponsive2: 'grid grid-cols-1 lg:grid-cols-2',
  
  // Flex layouts
  flexBetween: 'flex justify-between items-center',
  flexCenter: 'flex justify-center items-center',
  flexStart: 'flex justify-start items-center',
  flexEnd: 'flex justify-end items-center',
  flexCol: 'flex flex-col',
  flexWrap: 'flex flex-wrap',
  
  // Responsive
  responsiveFlex: 'flex flex-col lg:flex-row',
  responsiveText: 'text-center lg:text-left'
};

// Component-specific styles
export const components = {
  card: {
    base: 'bg-white rounded-xl shadow-lg p-6',
    hover: 'bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300',
    bordered: 'bg-white rounded-xl shadow-lg p-6 border border-gray-200',
    accent: 'bg-white rounded-xl shadow-lg p-6 border-l-4'
  },
  
  button: {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105',
    secondary: 'bg-gray-100 text-gray-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105'
  },
  
  input: {
    base: 'px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
    error: 'px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200'
  },
  
  tab: {
    active: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all duration-300 scale-105',
    inactive: 'bg-gray-100 text-gray-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 hover:scale-102'
  },
  
  metric: {
    card: 'bg-white p-6 rounded-xl shadow-lg border-l-4 hover:shadow-xl transition-all duration-300',
    value: 'text-2xl font-bold',
    label: 'text-sm font-medium text-gray-600',
    change: 'text-sm font-medium'
  }
};

// Chart colors that align with design system
export const chartColors = {
  primary: colors.primary[500],
  secondary: colors.secondary[500],
  accent: colors.accent[500],
  danger: colors.danger[500],
  warning: colors.warning[500],
  success: colors.success[500],
  
  // Chart palette
  palette: [
    colors.primary[500],    // #3b82f6
    colors.secondary[500],  // #22c55e  
    colors.accent[500],     // #d97706
    colors.danger[500],     // #ef4444
    colors.warning[500],    // #f59e0b
    '#8b5cf6',              // purple-500
    '#06b6d4',              // cyan-500
    '#f97316'               // orange-500
  ]
};

export default {
  colors,
  gradients,
  typography,
  spacing,
  borders,
  shadows,
  animations,
  layout,
  components,
  chartColors
};