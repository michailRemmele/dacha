import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  createContext,
} from 'react'

interface HotkeysProviderProps {
  selectedPaths: string[][]
  onMoveTo: (sourcePaths: string[][], destinationPath: string[]) => void
  onCopyTo: (sourcePaths: string[][], destinationPath: string[]) => void
  onRemove: (paths: string[][]) => void
  children: JSX.Element | Array<JSX.Element>
}

interface HotkeysContextProps {
  clipboard: string[][] | undefined
  isCut: boolean
  cut: () => void
  copy: () => void
  paste: () => void
  remove: () => void
}

export const HotkeysContext = createContext<HotkeysContextProps>({
  clipboard: undefined,
  isCut: false,
  cut: () => {},
  copy: () => {},
  paste: () => {},
  remove: () => {},
})

export const HotkeysProvider = ({
  selectedPaths,
  onMoveTo,
  onCopyTo,
  onRemove,
  children,
}: HotkeysProviderProps): JSX.Element => {
  const [clipboard, setClipboard] = useState<string[][] | undefined>()
  const [isCut, setIsCut] = useState(false)

  const handleCut = useCallback((): void => {
    if (!selectedPaths.length) {
      return
    }

    setClipboard(selectedPaths)
    setIsCut(true)
  }, [selectedPaths])

  const handleCopy = useCallback((): void => {
    if (!selectedPaths.length) {
      return
    }

    setClipboard(selectedPaths)
    setIsCut(false)
  }, [selectedPaths])

  const handlePaste = useCallback((): void => {
    if (!clipboard || !selectedPaths.length) {
      return
    }

    const destinationPath = selectedPaths.reduce((shortestPath, path) => {
      if (path.length < shortestPath.length) {
        return path
      }
      return shortestPath
    }).slice(0, -1)

    if (isCut) {
      onMoveTo(clipboard, destinationPath)
    } else {
      onCopyTo(clipboard, destinationPath)
    }

    setClipboard(undefined)
    setIsCut(false)
  }, [clipboard, isCut, selectedPaths])

  const handleRemove = useCallback((): void => {
    onRemove(selectedPaths)
  }, [selectedPaths])

  useEffect(() => {
    const cutUnsubscribe = window.electron.onCut(handleCut)
    const copyUnsubscribe = window.electron.onCopy(handleCopy)
    const pasteUnsubscribe = window.electron.onPaste(handlePaste)
    const removeUnsubscribe = window.electron.onDelete(handleRemove)

    return () => {
      cutUnsubscribe()
      copyUnsubscribe()
      pasteUnsubscribe()
      removeUnsubscribe()
    }
  }, [handleCut, handleCopy, handlePaste, handleRemove])

  const currentContext = useMemo(() => ({
    clipboard,
    isCut,
    cut: handleCut,
    copy: handleCopy,
    paste: handlePaste,
    remove: handleRemove,
  }), [clipboard, isCut, handleCut, handleCopy, handlePaste, handleRemove])

  return (
    <HotkeysContext.Provider value={currentContext}>
      {children}
    </HotkeysContext.Provider>
  )
}
