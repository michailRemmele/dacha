import { useMemo, useContext } from 'react'
import type { FC } from 'react'
import { ThemeProvider as ThemeProviderEmotion } from '@emotion/react'
import { theme } from 'antd'

import { customToken as customTokenLight } from '../../themes/light'
import { customToken as customTokenDark } from '../../themes/dark'
import type { CustomToken } from '../../themes/types'

import { ThemeContext } from './contexts'
import type { ThemeMode } from './types'

const TOKEN_MAP: Record<ThemeMode, CustomToken> = {
  light: customTokenLight,
  dark: customTokenDark,
}

interface ThemeTokenProviderProps {
  children: JSX.Element | JSX.Element[]
}

export const ThemeTokenProvider: FC<ThemeTokenProviderProps> = ({ children }) => {
  const { token } = theme.useToken()
  const mode = useContext(ThemeContext)

  const combinedToken = useMemo(() => ({
    ...token,
    ...TOKEN_MAP[mode],
  }), [token, mode])

  return (
    <ThemeProviderEmotion theme={combinedToken}>
      {children}
    </ThemeProviderEmotion>
  )
}
