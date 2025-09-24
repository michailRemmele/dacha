import {
  createContext,
  useState,
  useMemo,
} from 'react'
import type { FC } from 'react'

interface NotificationInstance {
  needsReload: boolean
  setNeedsReload: (needsReload: boolean) => void
}

interface NeedsReloadProviderProps {
  children: JSX.Element | JSX.Element[]
}

export const NeedsReloadContext = createContext({} as NotificationInstance)

export const NeedsReloadProvider: FC<NeedsReloadProviderProps> = ({ children }) => {
  const [needsReload, setNeedsReload] = useState(false)

  const providerValue = useMemo(() => ({
    needsReload,
    setNeedsReload,
  }), [needsReload, setNeedsReload])

  return (
    <NeedsReloadContext.Provider value={providerValue}>
      {children}
    </NeedsReloadContext.Provider>
  )
}
