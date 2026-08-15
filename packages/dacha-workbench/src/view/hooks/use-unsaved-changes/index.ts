import { useEffect, useContext, useRef } from 'react'

import { EventType } from '../../../events'
import { useConfig } from '../use-config'
import { useSaveProject } from '../use-save-project'
import { EngineContext } from '../../providers'
import { persistentStorage } from '../../../persistent-storage'

// Listens for project changes and notifies main process if there are any unsaved changes or not
export const useUnsavedChanges = (): void => {
  const context = useContext(EngineContext)

  const projectConfig = useConfig([])
  const { save } = useSaveProject()

  const didMountRef = useRef(false)
  const unsavedChangesRef = useRef(false)

  useEffect(() => {
    if (projectConfig === undefined) {
      return
    }
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }

    if (!unsavedChangesRef.current) {
      window.electron.setUnsavedChanges(true)
      unsavedChangesRef.current = true
    }
  }, [projectConfig])

  useEffect(() => {
    const handleUnload = (): void => {
      persistentStorage.saveImmediately()
      window.electron.setUnsavedChanges(false)
    }

    window.addEventListener('beforeunload', handleUnload)
    return (): void => window.removeEventListener('beforeunload', handleUnload)
  }, [])

  useEffect(() => {
    const handleBlur = (): void => {
      persistentStorage.saveImmediately()
      save()
    }

    window.addEventListener('blur', handleBlur)
    return (): void => window.removeEventListener('blur', handleBlur)
  }, [])

  useEffect(() => {
    if (!context) {
      return (): void => {}
    }

    const { world } = context

    const handleGameStateUpdate = (): void => {
      if (unsavedChangesRef.current) {
        window.electron.setUnsavedChanges(false)
        unsavedChangesRef.current = false
      }
    }

    world.addEventListener(EventType.SaveProject, handleGameStateUpdate)

    return (): void => world.removeEventListener(EventType.SaveProject, handleGameStateUpdate)
  }, [context])
}
