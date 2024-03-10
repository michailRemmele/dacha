import { useEffect, useContext, useRef } from 'react'

import { EventType } from '../../../events'
import { useConfig } from '../use-config'
import { EngineContext } from '../../providers'

// Listens for project changes and notifies main process if there are any unsaved changes or not
export const useUnsavedChanges = (): void => {
  const context = useContext(EngineContext)

  const projectConfig = useConfig([])

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
      window.electron.setUnsavedChanges(false)
    }

    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [])

  useEffect(() => {
    if (context === undefined) {
      return () => {}
    }

    const { scene } = context

    const handleGameStateUpdate = (): void => {
      if (unsavedChangesRef.current) {
        window.electron.setUnsavedChanges(false)
        unsavedChangesRef.current = false
      }
    }

    scene.addEventListener(EventType.SaveProject, handleGameStateUpdate)

    return () => scene.removeEventListener(EventType.SaveProject, handleGameStateUpdate)
  }, [context])
}
