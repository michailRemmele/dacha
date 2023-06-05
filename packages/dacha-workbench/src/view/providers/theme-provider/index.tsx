import { useMemo } from 'react'
import type { FC } from 'react'
import { ThemeProvider as ThemeProviderEmotion } from '@emotion/react'
import { theme } from 'antd'

import { customToken } from '../../themes/light'

interface ThemeProviderProps {
  children: JSX.Element | Array<JSX.Element>
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const { token } = theme.useToken()

  const combinedToken = useMemo(() => ({
    ...token,
    ...customToken,
  }), [token])

  return (
    <ThemeProviderEmotion theme={combinedToken}>
      {children}
    </ThemeProviderEmotion>
  )
}
