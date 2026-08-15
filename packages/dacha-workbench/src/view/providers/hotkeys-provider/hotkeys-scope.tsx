import React, {
  useEffect,
  useContext,
  FC,
} from 'react'

import { ROOT_SCOPE } from '../../../consts/scopes'

import { HotkeysContext } from './hotkeys-provider'

interface HotkeysScopeProps {
  name?: string
  children: JSX.Element | JSX.Element[]
}

export const HotkeysScopeContext = React.createContext<string>(ROOT_SCOPE)

export const HotkeysScopeProvider: FC<HotkeysScopeProps> = ({
  name = ROOT_SCOPE,
  children,
}): JSX.Element => {
  const { setActiveScope } = useContext(HotkeysContext)

  useEffect(() => {
    setActiveScope(name)

    return (): void => {
      setActiveScope(ROOT_SCOPE)
    }
  }, [name])

  return (
    <HotkeysScopeContext.Provider value={name}>
      {children}
    </HotkeysScopeContext.Provider>
  )
}
