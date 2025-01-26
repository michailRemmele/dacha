import {
  useContext,
  useMemo,
  FC,
} from 'react'
import type { TemplateConfig } from 'dacha'

import { InspectedEntityContext, EntitySelectionContext } from '../../../../providers'
import { useConfig } from '../../../../hooks'
import { Tree } from '../tree'
import { CHILDREN_FIELD_MAP } from '../../consts'

import { parseTemplates, getInspectedKey, getSelectedPaths } from './utils'

interface TemplatesTreeProps {
  onDrop?: (sourcePaths: string[][], destinationPath: string[]) => void
}

export const TemplatesTree: FC<TemplatesTreeProps> = ({ onDrop }) => {
  const { path: inspectedEntityPath } = useContext(InspectedEntityContext)
  const { paths: selectedEntitiesPaths } = useContext(EntitySelectionContext)

  const templates = useConfig('templates') as Array<TemplateConfig>
  const treeData = useMemo(() => parseTemplates(templates), [templates])

  return (
    <Tree
      treeData={treeData}
      inspectedKey={getInspectedKey(inspectedEntityPath)}
      selectedPaths={getSelectedPaths(selectedEntitiesPaths)}
      persistentStorageKey="explorer.tab.templates"
      draggable
      onDrop={onDrop}
      childrenFieldMap={CHILDREN_FIELD_MAP}
    />
  )
}
