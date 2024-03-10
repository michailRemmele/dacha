import React, {
  useEffect,
  useContext,
  FC,
} from 'react'

import { EngineContext } from '../engine-provider'
import { ROOT_SCOPE } from '../../../consts/command-scopes'
import { EventType } from '../../../events'

import { CommandContext } from './command-provider'

interface CommandScopeProps {
  name?: string
  children: JSX.Element | Array<JSX.Element>
}

export const CommandScopeContext = React.createContext<string>(ROOT_SCOPE)

export const CommandScopeProvider: FC<CommandScopeProps> = ({
  name = ROOT_SCOPE,
  children,
}): JSX.Element => {
  const engineContext = useContext(EngineContext)
  const { setActiveScope } = useContext(CommandContext)

  useEffect(() => {
    setActiveScope(name)

    return () => {
      setActiveScope(ROOT_SCOPE)
    }
  }, [name])

  useEffect(() => {
    if (engineContext === undefined) {
      return () => {}
    }

    const { scene } = engineContext

    return () => {
      scene.dispatchEvent(EventType.CommandClean, {
        scope: name,
      })
    }
  }, [engineContext])

  return (
    <CommandScopeContext.Provider value={name}>
      {children}
    </CommandScopeContext.Provider>
  )
}
