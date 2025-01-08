import {
  useContext,
  useMemo,
  FC,
} from 'react'
import type { TemplateConfig } from 'dacha'

import { InspectedEntityContext, EntitySelectionContext } from '../../../../providers'
import { useConfig } from '../../../../hooks'
import { Tree } from '../tree'

import { parseTemplates, getInspectedKey, getSelectedKeys } from './utils'

export const TemplatesTree: FC = () => {
  const { path: inspectedEntityPath } = useContext(InspectedEntityContext)
  const { paths: selectedEntitiesPaths } = useContext(EntitySelectionContext)

  const templates = useConfig('templates') as Array<TemplateConfig>
  const treeData = useMemo(() => parseTemplates(templates), [templates])

  return (
    <Tree
      treeData={treeData}
      inspectedKey={getInspectedKey(inspectedEntityPath)}
      selectedKeys={getSelectedKeys(selectedEntitiesPaths)}
      persistentStorageKey="explorer.tab.templates"
    />
  )
}
