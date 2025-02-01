import type { FC } from 'react'
import { useCallback, useContext, useMemo } from 'react'

import { deleteByPaths } from '../../../../../../../../commands'
import { AnimationEditorContext } from '../../providers'
import { useCommander } from '../../../../../../../../hooks'
import { HotkeysSectionProvider } from '../../../../../../../../providers'
import { CHILDREN_FIELD_MAP } from '../../const'
import { copyByPaths, moveByPaths } from '../../commands/states'

import { getSelectedPaths } from './utils'
import { List } from './list'
import { ActionBar } from './action-bar'

const ROOT_PATH = 'states'

interface StateListProps {
  className?: string
}

export const StateList: FC<StateListProps> = ({
  className = '',
}) => {
  const { path, entitySelection } = useContext(AnimationEditorContext)

  const { dispatch } = useCommander()

  const rootPath = useMemo(() => path.concat(ROOT_PATH), [path])

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
      rootPath={rootPath}
      selectedPaths={getSelectedPaths(entitySelection.paths)}
      onCopyTo={handleCopyTo}
      onMoveTo={handleMoveTo}
      onRemove={handleRemove}
    >
      <div className={className}>
        <ActionBar />
        <List onDrop={handleMoveTo} />
      </div>
    </HotkeysSectionProvider>
  )
}
