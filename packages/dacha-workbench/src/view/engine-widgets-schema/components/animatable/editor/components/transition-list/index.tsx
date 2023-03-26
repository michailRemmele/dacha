import React, {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Animation } from 'remiz'

import { cn } from '../../../../../../utils/cn'
import { useConfig, useCommander } from '../../../../../../hooks'
import { addValue } from '../../../../../../commands'
import { AnimationEditorContext } from '../../providers'

import './style.less'

interface TransitionListProps {
  className?: string
  onSelect: (id: string) => void
}

export const TransitionList: FC<TransitionListProps> = ({
  className = '',
  onSelect = (): void => void 0,
}) => {
  const { dispatch } = useCommander()
  const {
    path,
    selectedState,
    selectedTransition,
  } = useContext(AnimationEditorContext)

  const statesPath = useMemo(() => path.concat('states'), [path])
  const statePath = useMemo(() => statesPath.concat(`id:${selectedState as string}`), [statesPath, selectedState])
  const transitionsPath = useMemo(() => statePath.concat('transitions'), [statePath])

  const statesConfigs = useConfig(statesPath) as Array<Animation.StateConfig>
  const stateConfig = useConfig(statePath) as Animation.StateConfig
  const transitions = useConfig(transitionsPath) as Array<Animation.TransitionConfig>

  const statesNames = useMemo(() => statesConfigs.reduce((acc, item) => {
    acc[item.id] = item.name
    return acc
  }, {} as Record<string, string>), [statesConfigs])

  const handleAdd = useCallback(() => {
    dispatch(addValue(transitionsPath, {
      id: uuidv4(),
      state: stateConfig.id,
      time: 0,
      conditions: [],
    }))
  }, [dispatch, transitionsPath, stateConfig])

  const handleSelect = useCallback((id: string) => {
    onSelect(id)
  }, [onSelect])

  const renderTransition = useCallback(({ id, state }: Animation.TransitionConfig) => {
    const isSelected = id === selectedTransition
    return (
      <li
        className="transition-list__item"
        key={id}
      >
        <button
          className={cn(
            'transition-list__transition',
            isSelected && 'transition-list__transition_selected',
          )}
          type="button"
          onClick={(): void => handleSelect(id)}
        >
          {`${stateConfig.name} -> ${statesNames[state]}`}
        </button>
      </li>
    )
  }, [selectedTransition, handleSelect, selectedState])

  if (!selectedState) {
    return null
  }

  return (
    <ul className={`transition-list ${className}`}>
      {transitions.map(renderTransition)}
      <li className="transition-list__item" key="add-transition">
        <button
          className="transition-list__transition transition-list__transition_add"
          type="button"
          onClick={handleAdd}
        >
          Add New Transition
        </button>
      </li>
    </ul>
  )
}
