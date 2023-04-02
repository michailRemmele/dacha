import React, {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import { Tree } from 'antd'
import type { Animation } from 'remiz'

import { useConfig } from '../../../../../../hooks'
import { AnimationEditorContext } from '../../providers'
import type { SelectFn } from '../../../../../../../types/tree-node'

import { parseTransitions } from './utils'

export const List: FC = () => {
  const {
    path,
    selectedState,
    selectedTransition,
    selectTransition,
  } = useContext(AnimationEditorContext)

  const statesPath = useMemo(() => path.concat('states'), [path])
  const statePath = useMemo(() => statesPath.concat(`id:${selectedState as string}`), [statesPath, selectedState])
  const transitionsPath = useMemo(() => statePath.concat('transitions'), [statePath])

  const statesConfigs = useConfig(statesPath) as Array<Animation.StateConfig>
  const stateConfig = useConfig(statePath) as Animation.StateConfig
  const transitions = useConfig(transitionsPath) as Array<Animation.TransitionConfig>

  const statesNames = useMemo(() => statesConfigs.reduce((acc, item) => {
    acc[item.id] = item.name
    return acc
  }, {} as Record<string, string>), [statesConfigs])

  const treeData = useMemo(
    () => parseTransitions(transitions, stateConfig.name, statesNames),
    [transitions, stateConfig, statesNames],
  )

  const handleSelect = useCallback<SelectFn>((keys, { node }) => {
    selectTransition(node.key as string)
  }, [selectTransition])

  return (
    <Tree.DirectoryTree
      className="animation-editor__list"
      selectedKeys={selectedTransition ? [selectedTransition] : []}
      onSelect={handleSelect}
      treeData={treeData}
      showIcon={false}
    />
  )
}
