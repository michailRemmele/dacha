import type { Animation } from 'dacha'
import type { DataNode } from 'antd/lib/tree'
import { Route } from '@gravity-ui/icons'

import { Icon } from '../../../../../../../../components'

export interface TransitionDataNode extends DataNode {
  path: string[]
}

export const parseTransitions = (
  transitions: Animation.TransitionConfig[],
  path: string[],
  stateName: string,
  statesNames: Record<string, string>,
  defaultName: string,
): TransitionDataNode[] => transitions.map((transition) => ({
  key: transition.id,
  title: `${stateName} -> ${statesNames[transition.state] ?? defaultName}`,
  icon: <Icon icon={<Route />} />,
  isLeaf: true,
  path: path.concat('transitions', `id:${transition.id}`),
}))

export const getSelectedPaths = (
  paths: string[][],
): string[][] => paths.filter((path) => path.at(-2) === 'transitions')
