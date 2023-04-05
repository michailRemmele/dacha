import React, {
  useState,
  useMemo,
  useCallback,
  FC,
} from 'react'

import type { SelectedEntity } from '../../types'

interface AnimationEditorData {
  path: Array<string>
  selectedState?: string
  selectedSubstate?: string
  selectedTransition?: string
  selectedFrame?: string
  selectedEntity?: SelectedEntity

  selectState: (id?: string) => void
  selectSubstate: (id?: string) => void
  selectTransition: (id?: string) => void
  selectFrame: (id?: string) => void
}

interface AnimationEditorProviderProps {
  path: Array<string>
  children: JSX.Element | Array<JSX.Element>
}

export const AnimationEditorContext = React.createContext<AnimationEditorData>({
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
  const [selectedState, setState] = useState<string | undefined>()
  const [selectedSubstate, setSubstate] = useState<string | undefined>()
  const [selectedTransition, setTransition] = useState<string | undefined>()
  const [selectedFrame, setFrame] = useState<string | undefined>()
  const [selectedEntity, setEntity] = useState<SelectedEntity | undefined>()

  const selectState = useCallback((id?: string) => {
    setEntity(id ? { id, type: 'state' } : undefined)
    setState(id)
    setTransition(undefined)
    setFrame(undefined)
    setSubstate(undefined)
  }, [])

  const selectSubstate = useCallback((id?: string) => {
    setEntity(id ? { id, type: 'substate' } : undefined)
    setSubstate(id)
    setTransition(undefined)
    setFrame(undefined)
  }, [])

  const selectTransition = useCallback((id?: string) => {
    setEntity(id ? { id, type: 'transition' } : undefined)
    setTransition(id)
    setFrame(undefined)
    setSubstate(undefined)
  }, [])

  const selectFrame = useCallback((id?: string) => {
    setEntity(id ? { id, type: 'frame' } : undefined)
    setFrame(id)
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
