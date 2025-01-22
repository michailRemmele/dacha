import {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import type { Animation } from 'dacha'

import { getKey } from '../../utils'
import { AnimationEditorContext } from '../../providers'
import { useConfig } from '../../../../../../../../hooks'
import { STATE_TYPE } from '../../const'

import { Frame } from './frame'
import { ListStyled, ListItemStyled } from './timeline.style'

export const List: FC = () => {
  const {
    selectedFrame,
    selectedState,
    selectedSubstate,
    selectFrame,
  } = useContext(AnimationEditorContext)

  const statePath = selectedState as Array<string>
  const state = useConfig(statePath) as Animation.StateConfig

  const framesPath = useMemo(() => {
    if (state.type === STATE_TYPE.INDIVIDUAL) {
      return statePath.concat('timeline', 'frames')
    }
    if (!selectedSubstate) {
      return undefined
    }
    return selectedSubstate.concat('timeline', 'frames')
  }, [state, statePath, selectedSubstate])
  const frames = useConfig(framesPath) as Array<Animation.FrameConfig> | undefined

  const handleSelect = useCallback((path: Array<string>) => {
    selectFrame(path)
  }, [])

  if (framesPath === undefined || frames === undefined) {
    return null
  }

  const selectedId = getKey(selectedFrame)

  return (
    <ListStyled>
      {frames && frames.map(({ id }, index) => (
        <ListItemStyled key={id}>
          <Frame
            id={id}
            path={framesPath}
            title={String(index)}
            onSelect={handleSelect}
            isSelected={id === selectedId}
          />
        </ListItemStyled>
      ))}
    </ListStyled>
  )
}
