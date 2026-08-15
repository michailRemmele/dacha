import {
  useContext,
  useCallback,
  FC,
} from 'react'
import type { Animation } from 'dacha'

import { deleteByPaths } from '../../../../../../../../commands'
import { getStatePath, getSubstatePath } from '../../utils/paths'
import { useConfig, useCommander } from '../../../../../../../../hooks'
import { HotkeysSectionProvider } from '../../../../../../../../providers'
import { CHILDREN_FIELD_MAP } from '../../const'
import { AnimationEditorContext } from '../../providers'
import { copyByPaths, moveByPaths } from '../../commands/frames'

import { getSelectedPaths, getFramesPath } from './utils'
import { ActionBar } from './action-bar'
import { List } from './list'
import { TimelineWrapperStyled } from './timeline.style'

interface TimelineProps {
  className?: string
}

export const Timeline: FC<TimelineProps> = ({
  className = '',
}) => {
  const { entitySelection, inspectedEntity } = useContext(AnimationEditorContext)
  const statePath = inspectedEntity ? getStatePath(inspectedEntity.path) : undefined
  const substatePath = inspectedEntity ? getSubstatePath(inspectedEntity.path) : undefined
  const state = useConfig(statePath) as Animation.StateConfig | undefined
  const { dispatch } = useCommander()

  const framesPath = getFramesPath(state, statePath, substatePath)

  const handleCopyTo = useCallback(
    (source: string[][], destination: string[]) => dispatch(copyByPaths(source, destination)),
    [],
  )
  const handleMoveTo = useCallback(
    (source: string[][], destination: string[]) => dispatch(moveByPaths(source, destination)),
    [],
  )
  const handleRemove = useCallback((paths: string[][]) => dispatch(deleteByPaths(paths)), [])

  return (
    <HotkeysSectionProvider
      childrenFieldMap={CHILDREN_FIELD_MAP}
      rootPath={framesPath}
      selectedPaths={getSelectedPaths(entitySelection.paths)}
      onCopyTo={handleCopyTo}
      onMoveTo={handleMoveTo}
      onRemove={handleRemove}
    >
      <div className={className}>
        <ActionBar />
        <TimelineWrapperStyled>
          {!!state && <List />}
        </TimelineWrapperStyled>
      </div>
    </HotkeysSectionProvider>
  )
}
