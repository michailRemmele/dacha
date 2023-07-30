import {
  useContext,
  useCallback,
} from 'react'

import { EngineContext, CommandScopeContext } from '../../providers'
import { COMMAND_MSG } from '../../../consts/message-types'

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
  const { pushMessage } = useContext(EngineContext)
  const scope = useContext(CommandScopeContext)

  const dispatch = useCallback((command: Command, options?: DispatchOptions) => {
    pushMessage({
      type: COMMAND_MSG,
      scope,
      isEffect: options?.isEffect,
      ...command,
    })
  }, [pushMessage, scope])

  return { dispatch }
}
