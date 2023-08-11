import { useEffect, useContext, useRef } from 'react'
import type { MessageBus } from 'remiz'

import { useConfig } from '../use-config'
import { SAVE_PROJECT_MSG } from '../../../consts/message-types'
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

    const { messageBusObserver } = context

    const handleMessages = (messageBus: unknown): void => {
      const saveMessages = (messageBus as MessageBus).get(SAVE_PROJECT_MSG)
      if (saveMessages?.length && unsavedChangesRef.current) {
        window.electron.setUnsavedChanges(false)
        unsavedChangesRef.current = false
      }
    }

    messageBusObserver.subscribe(handleMessages)

    return () => messageBusObserver.unsubscribe(handleMessages)
  }, [context])
}
