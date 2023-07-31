import {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Tree } from 'antd'
import type { EventDataNode } from 'antd/lib/tree'
import type { Animation } from 'remiz'

import { useConfig, useExpandedKeys } from '../../../../../../../../hooks'
import { AnimationEditorContext } from '../../providers'
import type { SelectFn, ExpandFn } from '../../../../../../../../../types/tree-node'

import { TreeCSS } from './state-list.style'
import { parseStates } from './utils'
import type { DataNodeWithParent } from './utils'

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
    initialState,
    t('components.animatable.editor.state.initial.title'),
  ), [states, initialState])

  const { expandedKeys, setExpandedKeys } = useExpandedKeys(treeData)

  const handleSelect = useCallback<SelectFn>((keys, { node }) => {
    if (node.isLeaf) {
      selectState((node as EventDataNode<DataNodeWithParent>).parentKey)
      selectSubstate(node.key as string)
    } else {
      selectState(node.key as string)
    }
  }, [])

  const handleExpand = useCallback<ExpandFn>((keys) => {
    setExpandedKeys(keys as Array<string>)
  }, [])

  const selectedKey = selectedSubstate ?? selectedState
  const isInactive = selectedKey !== selectedEntity?.id

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
