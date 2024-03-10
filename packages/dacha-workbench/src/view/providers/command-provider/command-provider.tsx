import React, {
  useEffect,
  useContext,
  useMemo,
  useState,
} from 'react'

import { EngineContext } from '../engine-provider'
import { ROOT_SCOPE } from '../../../consts/command-scopes'
import { EventType } from '../../../events'

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

    const { scene } = engineContext

    const handleUndo = (): void => {
      scene.dispatchEvent(EventType.CommandUndo, {
        scope: activeScope,
      })
    }

    const handleRedo = (): void => {
      scene.dispatchEvent(EventType.CommandRedo, {
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
