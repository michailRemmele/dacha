import React, {
  useEffect,
  useContext,
  useMemo,
  useState,
} from 'react'

import { EngineContext } from '../engine-provider'
import {
  COMMAND_UNDO_MSG,
  COMMAND_REDO_MSG,
} from '../../../consts/message-types'
import { ROOT_SCOPE } from '../../../consts/command-scopes'

interface UndoRedoProviderProviderProps {
  children: JSX.Element | Array<JSX.Element>
}

interface CommandContextProps {
  activeScope: string
  setActiveScope: (context: string) => void
}

export const CommandContext = React.createContext<CommandContextProps>({} as CommandContextProps)

export const CommandProvider = ({
  children,
}: UndoRedoProviderProviderProps): JSX.Element => {
  const engineContext = useContext(EngineContext)

  const [activeScope, setActiveScope] = useState(ROOT_SCOPE)

  useEffect(() => {
    if (engineContext === undefined) {
      return () => {}
    }

    const { pushMessage } = engineContext

    const handleUndo = (): void => {
      pushMessage({
        type: COMMAND_UNDO_MSG,
        scope: activeScope,
      })
    }

    const handleRedo = (): void => {
      pushMessage({
        type: COMMAND_REDO_MSG,
        scope: activeScope,
      })
    }

    const undoUnsubscribe = window.electron.onUndo(handleUndo)
    const redoUnsubscribe = window.electron.onRedo(handleRedo)

    return () => {
      undoUnsubscribe()
      redoUnsubscribe()
    }
  }, [engineContext, activeScope])

  const currentContext = useMemo(() => ({
    activeScope,
    setActiveScope,
  }), [activeScope])

  return (
    <CommandContext.Provider value={currentContext}>
      {children}
    </CommandContext.Provider>
  )
}
