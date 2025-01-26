import type { FC } from 'react'
import { useCallback, useContext } from 'react'

import { useCommander } from '../../../../hooks'
import { EntitySelectionContext, HotkeysProvider } from '../../../../providers'
import { copyByPaths } from '../../../../commands/scenes'
import { deleteByPaths } from '../../../../commands'
import { CHILDREN_FIELD_MAP } from '../../consts'

import { ActionBar } from './action-bar'
import { SceneTree } from './tree'

const SCENES_ROOT_PATH = ['scenes']
const LOADERS_ROOT_PATH = ['loaders']

interface ScenesListProps {
  isLoaders?: boolean
}

export const ScenesList: FC<ScenesListProps> = ({ isLoaders }) => {
  const { paths: selectedPaths } = useContext(EntitySelectionContext)

  const { dispatch } = useCommander()

  const handleCopyTo = useCallback(
    (source: string[][], destination: string[]) => dispatch(copyByPaths(source, destination)),
    [],
  )
  // Can't move scenes anywhere
  const handleMoveTo = useCallback(() => {}, [])
  const handleRemove = useCallback((paths: string[][]) => dispatch(deleteByPaths(paths)), [])

  return (
    <HotkeysProvider
      childrenFieldMap={CHILDREN_FIELD_MAP}
      rootPath={isLoaders ? LOADERS_ROOT_PATH : SCENES_ROOT_PATH}
      selectedPaths={selectedPaths}
      onCopyTo={handleCopyTo}
      onMoveTo={handleMoveTo}
      onRemove={handleRemove}
    >
      <ActionBar isLoaders={isLoaders} />
      <SceneTree isLoaders={isLoaders} />
    </HotkeysProvider>
  )
}
