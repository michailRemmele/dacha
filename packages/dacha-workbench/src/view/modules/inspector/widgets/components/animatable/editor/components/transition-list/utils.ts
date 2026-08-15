import type { Animation } from 'dacha'
import type { DataNode } from 'antd/lib/tree'

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
  isLeaf: true,
  path: path.concat('transitions', `id:${transition.id}`),
}))

export const getSelectedPaths = (
  paths: string[][],
): string[][] => paths.filter((path) => path.at(-2) === 'transitions')
