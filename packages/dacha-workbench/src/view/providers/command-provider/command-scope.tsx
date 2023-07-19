import React, {
  useCallback,
  useEffect,
  useContext,
  useState,
  FC,
} from 'react'

import { CommandContext } from './command-provider'
import { DEFAULT_SCOPE } from './consts'

interface CommandScopeProps {
  name?: string
  className?: string
  children: JSX.Element | Array<JSX.Element>
}

export const CommandScopeContext = React.createContext<string>(DEFAULT_SCOPE)

export const CommandScope: FC<CommandScopeProps> = ({
  name = DEFAULT_SCOPE,
  className,
  children,
}): JSX.Element => {
  const { setActiveScope } = useContext(CommandContext)

  const [scopeNode, setScopeNode] = useState<HTMLDivElement | null>(null)

  const setRef = useCallback((node: HTMLDivElement) => {
    setScopeNode(node)
  }, [])

  useEffect(() => {
    if (scopeNode === null) {
      return () => {}
    }

    const handleFocus = (): void => {
      setActiveScope(name)
    }
    const handleBlur = (): void => {
      // Set the active scope back to the root,
      // because if there is no focused element before,
      // it will return to the body without focus event
      setActiveScope(DEFAULT_SCOPE)
    }

    scopeNode.addEventListener('focus', handleFocus, true)
    scopeNode.addEventListener('blur', handleBlur, true)

    return () => {
      scopeNode.removeEventListener('focus', handleFocus, true)
      scopeNode.removeEventListener('blur', handleBlur, true)
    }
  }, [scopeNode, name])

  return (
    <CommandScopeContext.Provider value={name}>
      <div className={className} ref={setRef}>
        {children}
      </div>
    </CommandScopeContext.Provider>
  )
}
