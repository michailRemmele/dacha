import { useCallback } from 'react'
import type { Config } from 'dacha'

import { useStore } from '../use-store'

interface UseSaveProjectReturn {
  save: () => void
}

export const useSaveProject = (): UseSaveProjectReturn => {
  const store = useStore()

  const save = useCallback(() => {
    const projectConfig = store.get([]) as Config
    window.electron.saveProjectConfig(projectConfig)
  }, [store])

  return { save }
}
