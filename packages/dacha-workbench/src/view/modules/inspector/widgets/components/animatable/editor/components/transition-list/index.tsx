import {
  useContext,
  useCallback,
  FC,
} from 'react'

import { getStatePath } from '../../utils/paths'
import { useConfig, useCommander } from '../../../../../../../../hooks'
import { HotkeysSectionProvider } from '../../../../../../../../providers'
import { CHILDREN_FIELD_MAP } from '../../const'
import { AnimationEditorContext } from '../../providers'
import { copyByPaths, moveByPaths } from '../../commands/transitions'
import { deleteByPaths } from '../../../../../../../../commands'

import { getSelectedPaths } from './utils'
import { List } from './list'
import { ActionBar } from './action-bar'

const ROOT_PATH = 'transitions'

interface TransitionListProps {
  className?: string
}

export const TransitionList: FC<TransitionListProps> = ({
  className = '',
}) => {
  const { entitySelection, inspectedEntity } = useContext(AnimationEditorContext)
  const statePath = inspectedEntity ? getStatePath(inspectedEntity.path) : undefined
  const state = useConfig(statePath)
  const { dispatch } = useCommander()

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
      rootPath={statePath?.concat(ROOT_PATH)}
      selectedPaths={getSelectedPaths(entitySelection.paths)}
      onCopyTo={handleCopyTo}
      onMoveTo={handleMoveTo}
      onRemove={handleRemove}
    >
      <div className={className}>
        <ActionBar />
        {!!state && <List />}
      </div>
    </HotkeysSectionProvider>
  )
}
