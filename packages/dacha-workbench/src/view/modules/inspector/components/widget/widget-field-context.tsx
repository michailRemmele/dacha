import { createContext, useMemo, ReactElement } from 'react'
import type { FC } from 'react'

export interface WidgetFieldContextType {
  path: string[]
  data: Record<string, unknown>
}

export const WidgetFieldContext = createContext<WidgetFieldContextType>({ path: [], data: {} })

interface WidgetFieldProviderProps {
  path: string[]
  data?: Record<string, unknown>
  children: ReactElement
}

export const WidgetFieldProvider: FC<WidgetFieldProviderProps> = ({ path, data, children }) => {
  const context = useMemo(() => ({
    path,
    data: { ...data },
  }), [path, data])

  return (
    <WidgetFieldContext.Provider value={context}>
      {children}
    </WidgetFieldContext.Provider>
  )
}
