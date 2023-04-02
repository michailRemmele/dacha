import type { Animation } from 'remiz'
import type { DataNode } from 'antd/lib/tree'

export const parseTransitions = (
  transitions: Array<Animation.TransitionConfig>,
  stateName: string,
  statesNames: Record<string, string>,
): Array<DataNode> => transitions.map((transition) => ({
  key: transition.id,
  title: `${stateName} -> ${statesNames[transition.state]}`,
  isLeaf: true,
}))
