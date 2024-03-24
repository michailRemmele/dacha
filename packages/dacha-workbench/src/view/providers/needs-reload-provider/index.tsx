import {
  createContext,
  useEffect,
  useState,
  useMemo,
} from 'react'
import type { FC } from 'react'

type NotificationInstance = {
  needsReload: boolean
  setNeedsReload: (needsReload: boolean) => void
}

interface NeedsReloadProviderProps {
  children: JSX.Element | Array<JSX.Element>
}

export const NeedsReloadContext = createContext({} as NotificationInstance)

export const NeedsReloadProvider: FC<NeedsReloadProviderProps> = ({ children }) => {
  const [needsReload, setNeedsReload] = useState(false)

  const providerValue = useMemo(() => ({
    needsReload,
    setNeedsReload,
  }), [needsReload, setNeedsReload])

  useEffect(() => {
    const handleNeedsReload = (): void => {
      setNeedsReload(true)
    }

    const unsubscribe = window.electron.onNeedsReload(handleNeedsReload)
    return () => unsubscribe()
  }, [])

  return (
    <NeedsReloadContext.Provider value={providerValue}>
      {children}
    </NeedsReloadContext.Provider>
  )
}
