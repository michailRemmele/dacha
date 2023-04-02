import React, {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import { Tree } from 'antd'
import type { EventDataNode } from 'antd/lib/tree'
import type { Animation } from 'remiz'

import { useConfig } from '../../../../../../hooks'
import { AnimationEditorContext } from '../../providers'
import { cn } from '../../../../../../utils/cn'
import type { SelectFn } from '../../../../../../../types/tree-node'

import { parseStates } from './utils'
import type { DataNodeWithParent } from './utils'

export const List: FC = () => {
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

  const treeData = useMemo(() => parseStates(states, initialState), [states, initialState])

  const handleSelect = useCallback<SelectFn>((keys, { node }) => {
    if (node.isLeaf) {
      selectState((node as EventDataNode<DataNodeWithParent>).parentKey)
      selectSubstate(node.key as string)
    } else {
      selectState(node.key as string)
    }
  }, [selectState, selectSubstate])

  const selectedKey = selectedSubstate ?? selectedState
  const isInactive = selectedKey !== selectedEntity?.id

  return (
    <Tree.DirectoryTree
      className={cn('animation-editor__list', isInactive && 'animation-editor__list_inactive')}
      selectedKeys={selectedKey ? [selectedKey] : []}
      onSelect={handleSelect}
      treeData={treeData}
      expandAction="doubleClick"
      showIcon={false}
    />
  )
}
