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
import { STATE_TYPE } from '../../const'

import { Frame } from './frame'

import './style.less'

interface TimelineProps {
  className?: string
  onSelect?: (id: string) => void
}

export const Timeline: FC<TimelineProps> = ({
  className = '',
  onSelect = (): void => void 0,
}) => {
  const { dispatch } = useCommander()
  const {
    path,
    selectedFrame,
    selectedState,
    selectedSubstate,
  } = useContext(AnimationEditorContext)

  const statePath = useMemo(
    () => path.concat('states', `id:${selectedState as string}`),
    [path, selectedState],
  )
  const state = useConfig(statePath) as Animation.StateConfig

  const framesPath = useMemo(
    () => {
      if (state.type === STATE_TYPE.INDIVIDUAL) {
        return statePath.concat('timeline', 'frames')
      }

      if (!selectedSubstate) {
        return undefined
      }

      return statePath.concat('substates', `id:${selectedSubstate}`, 'timeline', 'frames')
    },
    [statePath, state, selectedSubstate],
  )

  const frames = useMemo(() => {
    if (state.type === STATE_TYPE.INDIVIDUAL) {
      return (
        state as Animation.IndividualStateConfig
      ).timeline.frames
    }

    if (!selectedSubstate) {
      return undefined
    }

    return (state as Animation.GroupStateConfig).substates.find(
      (substate) => substate.id === selectedSubstate,
    )?.timeline.frames as Array<Animation.FrameConfig>
  }, [state, selectedSubstate])

  const handleAdd = useCallback(() => {
    dispatch(addValue(framesPath as Array<string>, {
      id: uuidv4(),
      fields: [],
    }))
  }, [dispatch, framesPath, frames])

  const handleSelect = useCallback((id: string) => {
    onSelect(id)
  }, [onSelect])

  if (!frames) {
    return null
  }

  return (
    <ul className={cn('timeline', className)}>
      {frames.map(({ id }, index) => (
        <li
          className="timeline__item"
          key={id}
        >
          <Frame
            id={id}
            title={String(index)}
            onSelect={handleSelect}
            isSelected={id === selectedFrame}
          />
        </li>
      ))}
      <li className="timeline__item" key="add-frame">
        <button
          className="timeline__frame timeline__frame_add"
          type="button"
          onClick={handleAdd}
        >
          Add New Frame
        </button>
      </li>
    </ul>
  )
}
