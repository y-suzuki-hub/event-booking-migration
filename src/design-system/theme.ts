// 値そのものは src/styles/_tokens.scss が持つ。ここではCSS変数への参照だけを型付きで公開する
const color = (name: string) => `var(--color-${name})`

export const theme = {
  color: {
    text: color('text'),
    muted: color('muted'),
    bg: color('bg'),
    surface: color('surface'),
    border: color('border'),
    primary: color('primary'),
    primaryHover: color('primary-hover'),
    primaryWeak: color('primary-weak'),
    success: color('success'),
    successWeak: color('success-weak'),
    warning: color('warning'),
    warningWeak: color('warning-weak'),
    danger: color('danger'),
    dangerWeak: color('danger-weak'),
  },
  space: (step: 1 | 2 | 3 | 4 | 5 | 6 | 7) => `var(--space-${step})`,
  radius: { sm: 'var(--radius-sm)', md: 'var(--radius-md)', lg: 'var(--radius-lg)', pill: 'var(--radius-pill)' },
  font: { xs: 'var(--font-xs)', sm: 'var(--font-sm)', md: 'var(--font-md)', lg: 'var(--font-lg)', xl: 'var(--font-xl)' },
  shadow: { card: 'var(--shadow-card)' },
} as const

export type AppTheme = typeof theme
