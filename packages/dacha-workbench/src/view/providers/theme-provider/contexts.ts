import { createContext } from 'react'

import type { ThemeMode } from './types'

export const ThemeContext = createContext<ThemeMode>('light')
