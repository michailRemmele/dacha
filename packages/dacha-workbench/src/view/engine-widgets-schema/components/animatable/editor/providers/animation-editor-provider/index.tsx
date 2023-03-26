import React, {
  useState,
  useMemo,
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
  setState: (id?: string) => void
  setSubstate: (id?: string) => void
  setTransition: (id?: string) => void
  setFrame: (id?: string) => void
  selectEntity: (entity?: SelectedEntity) => void
}

interface AnimationEditorProviderProps {
  path: Array<string>
  children: JSX.Element | Array<JSX.Element>
}

export const AnimationEditorContext = React.createContext<AnimationEditorData>({
  path: [],
  setState: () => void 0,
  setSubstate: () => void 0,
  setTransition: () => void 0,
  setFrame: () => void 0,
  selectEntity: () => void 0,
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

  const entityData = useMemo(() => ({
    path,
    selectedState,
    selectedSubstate,
    selectedTransition,
    selectedFrame,
    selectedEntity,
    setState,
    setSubstate,
    setTransition,
    setFrame,
    selectEntity: setEntity,
  }), [path, selectedState, selectedSubstate, selectedTransition, selectedFrame, selectedEntity])

  return (
    <AnimationEditorContext.Provider value={entityData}>
      {children}
    </AnimationEditorContext.Provider>
  )
}
