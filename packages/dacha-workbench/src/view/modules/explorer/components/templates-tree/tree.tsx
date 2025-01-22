import {
  useContext,
  useMemo,
  FC,
} from 'react'
import type { TemplateConfig } from 'dacha'

import { SelectedEntityContext } from '../../../../providers'
import { useConfig } from '../../../../hooks'
import { Tree } from '../tree'

import { parseTemplates, getKey } from './utils'

export const TemplatesTree: FC = () => {
  const { path: selectedEntityPath } = useContext(SelectedEntityContext)

  const templates = useConfig('templates') as Array<TemplateConfig>
  const selectedEntity = useConfig(selectedEntityPath)
  const treeData = useMemo(() => parseTemplates(templates), [templates])

  const selectedKey = getKey(selectedEntity, selectedEntityPath)

  return (
    <Tree
      treeData={treeData}
      selectedKey={selectedKey}
      persistentStorageKey="explorer.tab.templates"
    />
  )
}
