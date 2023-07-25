import {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import type { Animation } from 'remiz'

import { AnimationEditorContext } from '../../providers'
import { useConfig } from '../../../../../../../../hooks'
import { STATE_TYPE } from '../../const'

import { Frame } from './frame'
import { ListStyled, ListItemStyled } from './timeline.style'

export const List: FC = () => {
  const {
    path,
    selectedFrame,
    selectedState,
    selectedSubstate,
    selectFrame,
  } = useContext(AnimationEditorContext)

  const statePath = useMemo(
    () => path.concat('states', `id:${selectedState as string}`),
    [path, selectedState],
  )
  const state = useConfig(statePath) as Animation.StateConfig

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

  const handleSelect = useCallback((id: string) => {
    selectFrame(id)
  }, [])

  if (frames === undefined) {
    return null
  }

  return (
    <ListStyled>
      {frames && frames.map(({ id }, index) => (
        <ListItemStyled key={id}>
          <Frame
            id={id}
            title={String(index)}
            onSelect={handleSelect}
            isSelected={id === selectedFrame}
          />
        </ListItemStyled>
      ))}
    </ListStyled>
  )
}
