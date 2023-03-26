import React, {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import type { Animation } from 'remiz'

import { cn } from '../../../../../../utils/cn'
import { useConfig, useCommander } from '../../../../../../hooks'
import { addValue } from '../../../../../../commands'
import { AnimationEditorContext } from '../../providers'

import { SubstateList } from '../substate-list'
import { STATE_TYPE } from '../../const'

import './style.less'

interface StateListProps {
  className?: string
  onSelect: (id: string) => void
  onChildSelect: (id: string) => void
}

export const StateList: FC<StateListProps> = ({
  className = '',
  onSelect = (): void => void 0,
  onChildSelect = (): void => void 0,
}) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()
  const {
    path,
    selectedState,
    selectedEntity,
  } = useContext(AnimationEditorContext)

  const initialStatePath = useMemo(() => path.concat('initialState'), [path])
  const statesPath = useMemo(() => path.concat('states'), [path])

  const initialState = useConfig(initialStatePath) as string
  const states = useConfig(statesPath) as Array<Animation.StateConfig>

  const handleAdd = useCallback(() => {
    dispatch(addValue(statesPath, {
      id: uuidv4(),
      name: t('components.animatable.editor.state.new.title', { index: states.length }),
      type: STATE_TYPE.INDIVIDUAL,
      speed: 1,
      timeline: {
        frames: [],
        looped: false,
      },
      transitions: [],
    }))
  }, [dispatch, statesPath, states])

  const handleSelect = useCallback((id: string) => {
    onSelect(id)
  }, [onSelect])

  const renderState = useCallback((state: Animation.StateConfig) => {
    const { id, name, substates } = state as Animation.GroupStateConfig
    const isInitial = id === initialState
    const isSelected = id === selectedState
    const isInspected = id === selectedEntity?.id
    return (
      <li
        className="state-list__item"
        key={id}
      >
        <button
          className={cn(
            'state-list__state',
            isInitial && 'state-list__state_initial',
            isSelected && 'state-list__state_selected',
            isInspected && 'state-list__state_inspected',
            substates && 'state-list__state_group',
          )}
          type="button"
          onClick={(): void => handleSelect(id)}
        >
          {name}
          {isInitial && (
            <span className="state-list__state-label">
              (initial state)
            </span>
          )}
        </button>
        {substates && isSelected && <SubstateList onSelect={onChildSelect} />}
      </li>
    )
  }, [initialState, selectedState, handleSelect, onChildSelect, selectedEntity])

  return (
    <ul className={`state-list ${className}`}>
      {states.map(renderState)}
      <li className="state-list__item" key="add-state">
        <button
          className="state-list__state state-list__state_add"
          type="button"
          onClick={handleAdd}
        >
          Add New State
        </button>
      </li>
    </ul>
  )
}
