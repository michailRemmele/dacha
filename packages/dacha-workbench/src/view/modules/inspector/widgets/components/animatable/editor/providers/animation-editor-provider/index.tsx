import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  createContext,
  FC,
} from 'react'

import { useConfig } from '../../../../../../../../hooks'
import type { SelectedEntity } from '../../types'

type ObservableEntry = [unknown, unknown, () => void]

interface AnimationEditorData {
  path: Array<string>
  selectedState?: Array<string>
  selectedSubstate?: Array<string>
  selectedTransition?: Array<string>
  selectedFrame?: Array<string>
  selectedEntity?: SelectedEntity

  selectState: (path: Array<string>) => void
  selectSubstate: (path: Array<string>) => void
  selectTransition: (path: Array<string>) => void
  selectFrame: (path: Array<string>) => void
}

interface AnimationEditorProviderProps {
  path: Array<string>
  children: JSX.Element | Array<JSX.Element>
}

export const AnimationEditorContext = createContext<AnimationEditorData>({
  path: [],
  selectState: () => void 0,
  selectSubstate: () => void 0,
  selectTransition: () => void 0,
  selectFrame: () => void 0,
})

export const AnimationEditorProvider: FC<AnimationEditorProviderProps> = ({
  path,
  children,
}): JSX.Element => {
  const [selectedState, setState] = useState<Array<string> | undefined>()
  const [selectedSubstate, setSubstate] = useState<Array<string> | undefined>()
  const [selectedTransition, setTransition] = useState<Array<string> | undefined>()
  const [selectedFrame, setFrame] = useState<Array<string> | undefined>()
  const [selectedEntity, setEntity] = useState<SelectedEntity | undefined>()

  const state = useConfig(selectedState)
  const substate = useConfig(selectedSubstate)
  const transition = useConfig(selectedTransition)
  const frame = useConfig(selectedFrame)

  // Reset selection if entry was deleted from config
  useEffect(() => {
    const items: Array<ObservableEntry> = [
      [state, selectedState, (): void => setState(undefined)],
      [substate, selectedSubstate, (): void => setSubstate(undefined)],
      [transition, selectedTransition, (): void => setTransition(undefined)],
      [frame, selectedFrame, (): void => setFrame(undefined)],
    ]

    items.forEach(([data, entry, resetEntry]) => {
      if (data === undefined && entry !== undefined) {
        resetEntry()
        setEntity(undefined)
      }
    })
  }, [state, substate, transition, frame])

  const selectState = useCallback((statePath: Array<string>) => {
    setEntity({ path: statePath, type: 'state' })
    setState(statePath)
    setTransition(undefined)
    setFrame(undefined)
    setSubstate(undefined)
  }, [])

  const selectSubstate = useCallback((substatePath: Array<string>) => {
    setEntity({ path: substatePath, type: 'substate' })
    setSubstate(substatePath)
    setTransition(undefined)
    setFrame(undefined)
  }, [])

  const selectTransition = useCallback((transitionPath: Array<string>) => {
    setEntity({ path: transitionPath, type: 'transition' })
    setTransition(transitionPath)
    setFrame(undefined)
    setSubstate(undefined)
  }, [])

  const selectFrame = useCallback((framePath: Array<string>) => {
    setEntity({ path: framePath, type: 'frame' })
    setFrame(framePath)
    setTransition(undefined)
  }, [])

  const entityData = useMemo(() => ({
    path,
    selectedState,
    selectedSubstate,
    selectedTransition,
    selectedFrame,
    selectedEntity,

    selectState,
    selectSubstate,
    selectTransition,
    selectFrame,
  }), [path, selectedState, selectedSubstate, selectedTransition, selectedFrame, selectedEntity])

  return (
    <AnimationEditorContext.Provider value={entityData}>
      {children}
    </AnimationEditorContext.Provider>
  )
}
