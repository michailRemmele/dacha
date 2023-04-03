import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Tree } from 'antd'
import type { EventDataNode } from 'antd/lib/tree'
import type { Animation } from 'remiz'

import { useConfig } from '../../../../../../hooks'
import { AnimationEditorContext } from '../../providers'
import { cn } from '../../../../../../utils/cn'
import type { SelectFn, ExpandFn } from '../../../../../../../types/tree-node'

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

  const [expandedKeys, setExpandedKeys] = useState<Array<string>>([])

  const initialStatePath = useMemo(() => path.concat('initialState'), [path])
  const statesPath = useMemo(() => path.concat('states'), [path])

  const initialState = useConfig(initialStatePath) as string

  const states = useConfig(statesPath) as Array<Animation.StateConfig>
  const prevStates = useRef<Array<Animation.StateConfig>>(states)

  useEffect(() => {
    if (!selectedState) {
      return
    }

    const { substates = [] } = states
      .find((state) => state.id === selectedState) as Animation.GroupStateConfig
    const { substates: prevSubstates = [] } = prevStates.current
      .find((state) => state.id === selectedState) as Animation.GroupStateConfig

    if (substates.length > prevSubstates.length && !expandedKeys.includes(selectedState)) {
      setExpandedKeys(expandedKeys.concat(selectedState))
    }
    if (substates.length === 0 && expandedKeys.includes(selectedState)) {
      setExpandedKeys(expandedKeys.filter((key) => key !== selectedState))
    }

    prevStates.current = states
  }, [states])

  const treeData = useMemo(() => parseStates(
    states,
    initialState,
    t('components.animatable.editor.state.initial.title'),
  ), [states, initialState])

  const handleSelect = useCallback<SelectFn>((keys, { node }) => {
    if (node.isLeaf) {
      selectState((node as EventDataNode<DataNodeWithParent>).parentKey)
      selectSubstate(node.key as string)
    } else {
      selectState(node.key as string)
    }
  }, [selectState, selectSubstate])

  const handleExpand = useCallback<ExpandFn>((keys) => {
    setExpandedKeys(keys as Array<string>)
  }, [])

  const selectedKey = selectedSubstate ?? selectedState
  const isInactive = selectedKey !== selectedEntity?.id

  return (
    <Tree.DirectoryTree
      className={cn('animation-editor__list', isInactive && 'animation-editor__list_inactive')}
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
