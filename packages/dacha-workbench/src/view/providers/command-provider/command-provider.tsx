import React, {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { CommanderStore } from '../../../store'
import type { Data } from '../../../store'
import { ROOT_SCOPE } from '../../../consts/scopes'

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
    const handleUndo = (): void => {
      store.undo({ scope: activeScope })
    }

    const handleRedo = (): void => {
      store.redo({ scope: activeScope })
    }

    const undoUnsubscribe = window.electron.onUndo(handleUndo)
    const redoUnsubscribe = window.electron.onRedo(handleRedo)

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
