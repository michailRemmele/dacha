import {
  useContext,
  useCallback,
} from 'react'

import { EngineContext, CommandScopeContext } from '../../providers'
import { EventType } from '../../../events'

export interface DispatchOptions {
  isEffect?: boolean
}

export interface Command {
  command: string
  options: unknown
}

export type UseCommanderHook = () => {
  dispatch: (command: Command, options?: DispatchOptions) => void
}

export const useCommander: UseCommanderHook = () => {
  const { scene } = useContext(EngineContext)
  const scope = useContext(CommandScopeContext)

  const dispatch = useCallback((command: Command, options?: DispatchOptions) => {
    scene.emit(EventType.Command, {
      scope,
      isEffect: options?.isEffect,
      ...command,
    })
  }, [scene, scope])

  return { dispatch }
}
