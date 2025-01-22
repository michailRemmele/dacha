import {
  useContext,
  useMemo,
  FC,
} from 'react'
import type { SceneConfig } from 'dacha'

import { Tree } from '../tree'
import { EntitySelectionContext } from '../../../../providers'
import { useConfig } from '../../../../hooks'

import { parseScenes, getSelectedKeys } from './utils'

interface SceneTreeProps {
  isLoaders?: boolean
}

export const SceneTree: FC<SceneTreeProps> = ({ isLoaders = false }) => {
  const { paths: selectedEntitiesPaths } = useContext(EntitySelectionContext)

  const scenes = useConfig(isLoaders ? 'loaders' : 'scenes') as Array<SceneConfig>
  const treeData = useMemo(() => parseScenes(scenes, isLoaders), [scenes])

  return (
    <Tree
      treeData={treeData}
      selectedKeys={getSelectedKeys(selectedEntitiesPaths, isLoaders)}
      persistentStorageKey={isLoaders ? 'explorer.tab.loaders' : 'explorer.tab.scenes'}
    />
  )
}
