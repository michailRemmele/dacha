import type { FC } from 'react'
import { useCallback, useContext } from 'react'

import { useCommander } from '../../../../hooks'
import { EntitySelectionContext, HotkeysSectionProvider } from '../../../../providers'
import {
  copyByPaths,
  moveByPaths,
  deleteTemplates,
} from '../../../../commands/templates'
import { CHILDREN_FIELD_MAP } from '../../consts'

import { getSelectedPaths } from './utils'
import { ActionBar } from './action-bar'
import { TemplatesTree } from './tree'

const ROOT_PATH = ['templates']

export const TemplatesExplorer: FC = () => {
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
  const handleRemove = useCallback((paths: string[][]) => dispatch(deleteTemplates(paths)), [])

  return (
    <HotkeysSectionProvider
      childrenFieldMap={CHILDREN_FIELD_MAP}
      rootPath={ROOT_PATH}
      selectedPaths={getSelectedPaths(selectedPaths)}
      onCopyTo={handleCopyTo}
      onMoveTo={handleMoveTo}
      onRemove={handleRemove}
    >
      <ActionBar />
      <TemplatesTree onDrop={handleMoveTo} />
    </HotkeysSectionProvider>
  )
}
