import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useContext,
  createContext,
} from 'react'

import { filterNestedPaths } from '../../../utils/filter-nested-paths'
import { arraysEqual } from '../../../utils/arrays-equal'

import { HotkeysContext } from './hotkeys-provider'
import { HotkeysScopeContext } from './hotkeys-scope'

interface HotkeysSectionProviderProps {
  childrenFieldMap: Record<string, string | undefined>
  rootPath?: string[]
  selectedPaths: string[][]
  onMoveTo: (sourcePaths: string[][], destinationPath: string[]) => void
  onCopyTo: (sourcePaths: string[][], destinationPath: string[]) => void
  onRemove: (paths: string[][]) => void
  children: JSX.Element | JSX.Element[]
}

interface HotkeysSectionContextProps {
  clipboard: string[][] | undefined
  isCut: boolean
  cut: () => void
  copy: () => void
  paste: () => void
  remove: () => void
}

export const HotkeysSectionContext = createContext<HotkeysSectionContextProps>({
  clipboard: undefined,
  isCut: false,
  cut: () => {},
  copy: () => {},
  paste: () => {},
  remove: () => {},
})

export const HotkeysSectionProvider = ({
  childrenFieldMap,
  rootPath,
  selectedPaths,
  onMoveTo,
  onCopyTo,
  onRemove,
  children,
}: HotkeysSectionProviderProps): JSX.Element => {
  const scope = useContext(HotkeysScopeContext)
  const { addHotkeyListener, removeHotkeyListener } = useContext(HotkeysContext)

  const [clipboard, setClipboard] = useState<string[][] | undefined>()
  const [isCut, setIsCut] = useState(false)

  const handleCut = useCallback((): void => {
    const paths = filterNestedPaths(selectedPaths)
    setClipboard(paths.length ? paths : undefined)
    setIsCut(true)
  }, [selectedPaths])

  const handleCopy = useCallback((): void => {
    const paths = filterNestedPaths(selectedPaths)
    setClipboard(paths.length ? paths : undefined)
    setIsCut(false)
  }, [selectedPaths])

  const handlePaste = useCallback((): void => {
    if (!clipboard) {
      return
    }

    let destinationPath = rootPath

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

    if (destinationPath === undefined) {
      return
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

  const handleDelete = useCallback((): void => {
    if (!selectedPaths.length) {
      return
    }

    onRemove(selectedPaths)
  }, [selectedPaths])

  useEffect(() => {
    addHotkeyListener(scope, 'cut', handleCut)
    addHotkeyListener(scope, 'copy', handleCopy)
    addHotkeyListener(scope, 'paste', handlePaste)
    addHotkeyListener(scope, 'delete', handleDelete)

    return (): void => {
      removeHotkeyListener(scope, 'cut', handleCut)
      removeHotkeyListener(scope, 'copy', handleCopy)
      removeHotkeyListener(scope, 'paste', handlePaste)
      removeHotkeyListener(scope, 'delete', handleDelete)
    }
  }, [
    scope, addHotkeyListener, removeHotkeyListener,
    handleCut, handleCopy, handlePaste, handleDelete,
  ])

  const currentContext = useMemo(() => ({
    clipboard,
    isCut,
    cut: handleCut,
    copy: handleCopy,
    paste: handlePaste,
    remove: handleDelete,
  }), [clipboard, isCut, handleCut, handleCopy, handlePaste, handleDelete])

  return (
    <HotkeysSectionContext.Provider value={currentContext}>
      {children}
    </HotkeysSectionContext.Provider>
  )
}
