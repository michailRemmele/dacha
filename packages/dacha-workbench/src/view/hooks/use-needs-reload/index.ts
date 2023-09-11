import { useEffect } from 'react'

import { useReloadNotification } from '../use-reload-notification'

export const useNeedsReload = (): void => {
  const showReloadNotification = useReloadNotification()

  useEffect(() => {
    const unsubscribe = window.electron.onNeedsReload(showReloadNotification)

    return () => unsubscribe()
  }, [])
}
