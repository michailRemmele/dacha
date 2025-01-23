import type { FC } from 'react'
import { useCallback, useContext } from 'react'

import { useCommander } from '../../../../hooks'
import { EntitySelectionContext, HotkeysProvider } from '../../../../providers'
import {
  copyByPaths,
  moveByPaths,
} from '../../../../commands/levels'
import { deleteByPaths } from '../../../../commands'
import { CHILDREN_FIELD_MAP } from '../../consts'

import { ActionBar } from './action-bar'
import { LevelsTree } from './tree'
import { TreeCSS } from './level-tree.style'

const ROOT_PATH = ['levels']

export const LevelsExplorer: FC = () => {
  const { paths: selectedPaths } = useContext(EntitySelectionContext)

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
    <HotkeysProvider
      childrenFieldMap={CHILDREN_FIELD_MAP}
      rootPath={ROOT_PATH}
      selectedPaths={selectedPaths}
      onCopyTo={handleCopyTo}
      onMoveTo={handleMoveTo}
      onRemove={handleRemove}
    >
      <ActionBar />
      <LevelsTree css={TreeCSS} />
    </HotkeysProvider>
  )
}
