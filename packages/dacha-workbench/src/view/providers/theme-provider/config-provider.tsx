import { useContext } from 'react'
import type { FC } from 'react'
import { ConfigProvider as ConfigProviderAntd } from 'antd'
import type { ThemeConfig } from 'antd'

import { customTheme as customThemeLight } from '../../themes/light'
import { customTheme as customThemeDark } from '../../themes/dark'

import { ThemeContext } from './contexts'
import type { ThemeMode } from './types'

const CONFIG_MAP: Record<ThemeMode, ThemeConfig> = {
  light: customThemeLight,
  dark: customThemeDark,
}

interface ConfigProviderProps {
  children: JSX.Element | JSX.Element[]
}

export const ConfigProvider: FC<ConfigProviderProps> = ({ children }) => {
  const mode = useContext(ThemeContext)

  return (
    <ConfigProviderAntd theme={CONFIG_MAP[mode]}>
      {children}
    </ConfigProviderAntd>
  )
}
