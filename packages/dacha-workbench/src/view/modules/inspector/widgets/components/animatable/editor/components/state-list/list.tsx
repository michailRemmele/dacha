import {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Tree } from 'antd'
import type { Animation } from 'dacha'

import { getStatePath, getSubstatePath } from '../../utils/paths'
import { getKey } from '../../utils'
import { useConfig, useTreeKeys } from '../../../../../../../../hooks'
import { AnimationEditorContext } from '../../providers'
import type { SelectFn, ExpandFn } from '../../../../../../../../../types/tree-node'

import { TreeCSS } from './state-list.style'
import { parseStates } from './utils'
import type { StateDataNode } from './utils'

export const List: FC = () => {
  const { t } = useTranslation()
  const {
    path,
    selectedEntity,
    selectEntity,
  } = useContext(AnimationEditorContext)

  const statePath = selectedEntity ? getStatePath(selectedEntity.path) : undefined
  const substatePath = selectedEntity ? getSubstatePath(selectedEntity.path) : undefined

  const initialStatePath = useMemo(() => path.concat('initialState'), [path])
  const statesPath = useMemo(() => path.concat('states'), [path])

  const initialState = useConfig(initialStatePath) as string

  const states = useConfig(statesPath) as Array<Animation.StateConfig>

  const treeData = useMemo(() => parseStates(
    states,
    path,
    initialState,
    t('components.animatable.editor.state.initial.title'),
  ), [states, initialState, path])

  const { expandedKeys, setExpandedKeys } = useTreeKeys(treeData)

  const handleSelect = useCallback<SelectFn<StateDataNode>>((keys, { node }) => {
    selectEntity(node.path)
  }, [])

  const handleExpand = useCallback<ExpandFn>((keys) => {
    setExpandedKeys(keys as Array<string>)
  }, [])

  const selectedKey = getKey(substatePath ?? statePath)
  const isInactive = selectedKey !== getKey(selectedEntity?.path)

  return (
    <Tree.DirectoryTree
      css={TreeCSS(isInactive)}
      selectedKeys={selectedKey ? [selectedKey] : []}
      expandedKeys={expandedKeys}
      onSelect={handleSelect}
      onExpand={handleExpand}
      treeData={treeData}
      expandAction="doubleClick"
      showIcon={false}
    />
  )
}
