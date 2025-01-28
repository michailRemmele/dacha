import {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import type { Animation } from 'dacha'

import { getStatePath, getSubstatePath } from '../../utils/paths'
import { getKey } from '../../utils'
import { AnimationEditorContext } from '../../providers'
import { useConfig } from '../../../../../../../../hooks'
import { STATE_TYPE } from '../../const'

import { Frame } from './frame'
import { ListStyled, ListItemStyled } from './timeline.style'

export const List: FC = () => {
  const {
    selectedEntity,
    selectEntity,
  } = useContext(AnimationEditorContext)

  const statePath = getStatePath(selectedEntity?.path as string[]) as string[]
  const substatePath = getSubstatePath(selectedEntity?.path as string[])
  const framePath = selectedEntity?.type === 'frame' ? selectedEntity.path : undefined

  const state = useConfig(statePath) as Animation.StateConfig

  const framesPath = useMemo(() => {
    if (state.type === STATE_TYPE.INDIVIDUAL) {
      return statePath.concat('timeline', 'frames')
    }
    if (!substatePath) {
      return undefined
    }
    return substatePath.concat('timeline', 'frames')
  }, [state, statePath, substatePath])
  const frames = useConfig(framesPath) as Array<Animation.FrameConfig> | undefined

  const handleSelect = useCallback((path: Array<string>) => {
    selectEntity(path)
  }, [])

  if (framesPath === undefined || frames === undefined) {
    return null
  }

  const selectedId = getKey(framePath)

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
