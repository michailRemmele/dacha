import { useState, useEffect } from 'react'
import type { FC } from 'react'

import { ConfigProvider } from './config-provider'
import { ThemeTokenProvider } from './theme-token-provider'
import { ThemeContext } from './contexts'
import type { ThemeMode } from './types'

interface ThemeProviderProps {
  children: JSX.Element | JSX.Element[]
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light')

  useEffect(() => {
    const handleSwitchTheme = (): void => {
      const newMode = mode === 'light' ? 'dark' : 'light'

      if (newMode === 'dark') {
        document.body.classList.add('editor-theme_dark')
      } else {
        document.body.classList.remove('editor-theme_dark')
      }

      setMode(newMode)
    }

    const unsubscribe = window.electron.onSwitchTheme(handleSwitchTheme)

    return (): void => unsubscribe()
  }, [mode])

  return (
    <ThemeContext.Provider value={mode}>
      <ConfigProvider>
        <ThemeTokenProvider>
          {children}
        </ThemeTokenProvider>
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}
