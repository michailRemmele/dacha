import { theme } from 'antd'

import type { CustomToken } from './types'

export const customToken: CustomToken = {
  // place your custom tokens here
  example: '#1d1d1d',
}

export const customTheme = { algorithm: [theme.darkAlgorithm, theme.compactAlgorithm] }
