import {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
  createContext,
} from 'react'

import { ROOT_SCOPE } from '../../../consts/scopes'

type HotkeyType = 'cut' | 'copy' | 'paste' | 'remove'

type HotkeyListeners = Record<string, Record<HotkeyType, (() => void)[]>>

interface HotkeysProviderProps {
  children: JSX.Element | Array<JSX.Element>
}

interface HotkeysContextProps {
  activeScope: string
  setActiveScope: (context: string) => void
  addHotkeyListener: (scope: string, hotkey: HotkeyType, callback: () => void) => void
  removeHotkeyListener: (scope: string, hotkey: HotkeyType, callback: () => void) => void
}

export const HotkeysContext = createContext<HotkeysContextProps>({
  activeScope: ROOT_SCOPE,
  setActiveScope: () => {},
  addHotkeyListener: () => {},
  removeHotkeyListener: () => {},
})

export const HotkeysProvider = ({ children }: HotkeysProviderProps): JSX.Element => {
  const listenersRef = useRef<HotkeyListeners>({})

  const [activeScope, setActiveScope] = useState(ROOT_SCOPE)

  const handleAddHotkeyListener = useCallback(
    (scope: string, hotkey: HotkeyType, callback: () => void) => {
      const hotkeyListeners = listenersRef.current
      hotkeyListeners[scope] ??= {
        cut: [],
        copy: [],
        paste: [],
        remove: [],
      }

      hotkeyListeners[scope][hotkey].push(callback)
    },
    [],
  )
  const handleRemoveHotkeyListener = useCallback(
    (scope: string, hotkey: HotkeyType, callback: () => void) => {
      const hotkeyListeners = listenersRef.current
      if (!hotkeyListeners[scope]) {
        return
      }

      hotkeyListeners[scope][hotkey] = hotkeyListeners[scope][hotkey].filter(
        (fn) => fn !== callback,
      )
    },
    [],
  )

  useEffect(() => {
    const handleHotkeyEvent = (hotkey: HotkeyType) => () => {
      const hotkeyListeners = listenersRef.current
      if (!hotkeyListeners[activeScope]) {
        return
      }

      hotkeyListeners[activeScope][hotkey].forEach((callback) => callback())
    }

    const cutUnsubscribe = window.electron.onCut(handleHotkeyEvent('cut'))
    const copyUnsubscribe = window.electron.onCopy(handleHotkeyEvent('copy'))
    const pasteUnsubscribe = window.electron.onPaste(handleHotkeyEvent('paste'))
    const removeUnsubscribe = window.electron.onDelete(handleHotkeyEvent('remove'))

    return () => {
      cutUnsubscribe()
      copyUnsubscribe()
      pasteUnsubscribe()
      removeUnsubscribe()
    }
  }, [activeScope])

  const currentContext = useMemo(() => ({
    activeScope,
    setActiveScope,
    addHotkeyListener: handleAddHotkeyListener,
    removeHotkeyListener: handleRemoveHotkeyListener,
  }), [activeScope, setActiveScope, handleAddHotkeyListener, handleRemoveHotkeyListener])

  return (
    <HotkeysContext.Provider value={currentContext}>
      {children}
    </HotkeysContext.Provider>
  )
}
