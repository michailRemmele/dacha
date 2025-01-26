import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  createContext,
} from 'react'

import { filterNestedPaths } from '../../../utils/filter-nested-paths'
import { arraysEqual } from '../../../utils/arrays-equal'

interface HotkeysProviderProps {
  childrenFieldMap: Record<string, string | undefined>
  rootPath: string[]
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
  childrenFieldMap,
  rootPath,
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

    setClipboard(filterNestedPaths(selectedPaths))
    setIsCut(true)
  }, [selectedPaths])

  const handleCopy = useCallback((): void => {
    if (!selectedPaths.length) {
      return
    }

    setClipboard(filterNestedPaths(selectedPaths))
    setIsCut(false)
  }, [selectedPaths])

  const handlePaste = useCallback((): void => {
    if (!clipboard) {
      return
    }

    let destinationPath: string[] = rootPath

    if (selectedPaths.length) {
      const shortestPath = selectedPaths.reduce((acc, path) => {
        if (path.length < acc.length) {
          return path
        }
        return acc
      })
      const childrenField = childrenFieldMap[shortestPath.at(-2) as string]

      destinationPath = childrenField ? shortestPath.concat(childrenField) : rootPath
    }

    if (isCut) {
      if (clipboard.every((path) => !arraysEqual(path.slice(0, -1), destinationPath))) {
        onMoveTo(clipboard, destinationPath)
      }
      setClipboard(undefined)
      setIsCut(false)
    } else {
      onCopyTo(clipboard, destinationPath)
    }
  }, [clipboard, isCut, selectedPaths, childrenFieldMap, rootPath])

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
