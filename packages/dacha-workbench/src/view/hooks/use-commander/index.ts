import {
  useContext,
  useCallback,
} from 'react'

import { useStore } from '../use-store'
import { EngineContext, CommandScopeContext } from '../../providers'
import { EventType } from '../../../events'

export interface DispatchOptions {
  isEffect?: boolean
}

export interface Command {
  command: string
  options: unknown
  isEffect?: boolean
}

export type GetStateFn = (path: Array<string>) => unknown
export type ThunkFn = (dispatch: DispatchFn, getState: GetStateFn) => void
export type DispatchFn = (commandOrThunkFn: Command | ThunkFn) => void

export type UseCommanderHook = () => {
  dispatch: DispatchFn
}

export const useCommander: UseCommanderHook = () => {
  const { scene } = useContext(EngineContext)
  const scope = useContext(CommandScopeContext)

  const store = useStore()

  const dispatch = useCallback<DispatchFn>((commandOrThunkFn) => {
    if (typeof commandOrThunkFn === 'function') {
      commandOrThunkFn(dispatch, (path) => store?.get(path))
      return
    }

    scene.dispatchEvent(EventType.Command, {
      scope,
      ...commandOrThunkFn,
    })
  }, [scene, scope, store])

  return { dispatch }
}
