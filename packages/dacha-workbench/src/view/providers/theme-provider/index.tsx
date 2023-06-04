import React, { FC } from 'react'
import { ThemeProvider as ThemeProviderEmotion } from '@emotion/react'
import { theme } from 'antd'

interface ThemeProviderProps {
  children: JSX.Element | Array<JSX.Element>
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const { token } = theme.useToken()
  console.log(token)
  return (
    <ThemeProviderEmotion theme={token}>
      {children}
    </ThemeProviderEmotion>
  )
}
