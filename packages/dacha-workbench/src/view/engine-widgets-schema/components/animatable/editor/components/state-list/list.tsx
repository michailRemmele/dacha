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

interface ListProps {
  onSelect: (id: string) => void
  onChildSelect: (id: string) => void
}

export const List: FC<ListProps> = ({
  onSelect,
  onChildSelect,
}) => {
  const {
    path,
    selectedState,
    selectedSubstate,
    selectedEntity,
  } = useContext(AnimationEditorContext)

  const initialStatePath = useMemo(() => path.concat('initialState'), [path])
  const statesPath = useMemo(() => path.concat('states'), [path])

  const initialState = useConfig(initialStatePath) as string
  const states = useConfig(statesPath) as Array<Animation.StateConfig>

  const treeData = useMemo(() => parseStates(states, initialState), [states, initialState])

  const handleSelect = useCallback<SelectFn>((keys, { node }) => {
    if (node.isLeaf) {
      onSelect((node as EventDataNode<DataNodeWithParent>).parentKey)
      onChildSelect(node.key as string)
    } else {
      onSelect(node.key as string)
    }
  }, [onSelect, onChildSelect])

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
