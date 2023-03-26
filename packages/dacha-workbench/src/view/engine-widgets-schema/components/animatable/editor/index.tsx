import React, {
  useCallback,
  useContext,
  FC,
} from 'react'

import {
  StateList,
  TransitionList,
  Timeline,
  Inspector,
} from './components'
import { AnimationEditorContext } from './providers'

import './style.less'

export const Editor: FC = () => {
  const {
    selectEntity,
    setState,
    setTransition,
    setFrame,
    setSubstate,
    selectedEntity,
    selectedState,
  } = useContext(AnimationEditorContext)

  const handleStateSelect = useCallback((id: string) => {
    selectEntity({ id, type: 'state' })
    setState(id)
    setTransition()
    setFrame()
    setSubstate()
  }, [selectEntity, setTransition, setFrame, setSubstate])

  const handleSubstateSelect = useCallback((id: string) => {
    selectEntity({ id, type: 'substate' })
    setSubstate(id)
    setTransition()
    setFrame()
  }, [selectEntity, setTransition, setFrame])

  const handleTransitionSelect = useCallback((id: string) => {
    selectEntity({ id, type: 'transition' })
    setTransition(id)
    setFrame()
    setSubstate()
  }, [selectEntity, setFrame, setSubstate])

  const handleFrameSelect = useCallback((id: string) => {
    selectEntity({ id, type: 'frame' })
    setFrame(id)
    setTransition()
  }, [selectEntity, setTransition])

  return (
    <div className="animation-editor">
      <section className="animation-editor__section">
        <section className="animation-editor__state-tree">
          <StateList
            className="animation-editor__state-list"
            onSelect={handleStateSelect}
            onChildSelect={handleSubstateSelect}
          />
          {selectedState && (
            <TransitionList
              className="animation-editor__transition-list"
              onSelect={handleTransitionSelect}
            />
          )}
        </section>
        {selectedState && (
          <footer className="animation-editor__footer">
            <Timeline
              className="animation-editor__timeline"
              onSelect={handleFrameSelect}
            />
          </footer>
        )}
      </section>
      <aside className="animation-editor__aside">
        {selectedEntity && <Inspector entityType={selectedEntity.type} />}
      </aside>
    </div>
  )
}
