import type { Animation } from 'remiz'
import type { DataNode } from 'antd/lib/tree'

export interface DataNodeWithParent extends DataNode {
  parentKey: string
}

const parseSubstate = (
  {
    id,
    name,
    x,
    y,
  }: Animation.SubstateConfig,
  parentKey: string,
): DataNodeWithParent => ({
  key: id,
  title: `${name} (x: ${x}${y !== undefined ? `, y: ${y}` : ''})`,
  isLeaf: true,
  parentKey,
})

export const parseStates = (
  states: Array<Animation.StateConfig>,
  initialState: string,
): Array<DataNode> => states.map((state) => ({
  key: state.id,
  title: `${state.name}${state.id === initialState ? ' (Initial State)' : ''}`,
  children: (state as Animation.GroupStateConfig)?.substates?.map(
    (substate) => parseSubstate(substate, state.id),
  ),
}))
