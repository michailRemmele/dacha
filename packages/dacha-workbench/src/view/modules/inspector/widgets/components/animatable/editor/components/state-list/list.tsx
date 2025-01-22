import {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Tree } from 'antd'
import type { Animation } from 'dacha'

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
    selectedState,
    selectedSubstate,
    selectedEntity,
    selectState,
    selectSubstate,
  } = useContext(AnimationEditorContext)

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
    if (node.isLeaf) {
      selectState(node.parent?.path as Array<string>)
      selectSubstate(node.path)
    } else {
      selectState(node.path)
    }
  }, [])

  const handleExpand = useCallback<ExpandFn>((keys) => {
    setExpandedKeys(keys as Array<string>)
  }, [])

  const selectedKey = getKey(selectedSubstate ?? selectedState)
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
