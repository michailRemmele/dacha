import React, {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { CommanderStore } from '../../../store'
import type { Data } from '../../../store'
import { ROOT_SCOPE } from '../../../consts/scopes'

type OperationType = 'undo' | 'redo'

interface UndoRedoProviderProviderProps {
  children: JSX.Element | Array<JSX.Element>
}

interface CommandContextProps {
  store: CommanderStore
  activeScope: string
  setActiveScope: (context: string) => void
}

export const CommandContext = React.createContext<CommandContextProps>({} as CommandContextProps)

export const CommandProvider = ({
  children,
}: UndoRedoProviderProviderProps): JSX.Element => {
  const store = useMemo(() => {
    const projectConfig = window.electron.getProjectConfig()
    return new CommanderStore(projectConfig as unknown as Data)
  }, [])

  const [activeScope, setActiveScope] = useState(ROOT_SCOPE)

  useEffect(() => {
    const handleOperation = (operation: OperationType) => () => {
      const { activeElement } = document
      if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
        document.execCommand(operation)
        return
      }

      store[operation]({ scope: activeScope })
    }

    const undoUnsubscribe = window.electron.onUndo(handleOperation('undo'))
    const redoUnsubscribe = window.electron.onRedo(handleOperation('redo'))

    return () => {
      undoUnsubscribe()
      redoUnsubscribe()
    }
  }, [activeScope])

  const currentContext = useMemo(() => ({
    store,
    activeScope,
    setActiveScope,
  }), [activeScope])

  return (
    <CommandContext.Provider value={currentContext}>
      {children}
    </CommandContext.Provider>
  )
}
