import React from 'react'
import type { ReactNode } from 'react'
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
  initialSuffix: string,
): Array<DataNode> => states.map((state) => ({
  key: state.id,
  title: (): ReactNode => {
    if (state.id === initialState) {
      return (
        <>
          <span className="animation-editor__list-item_initial">{state.name}</span>
          <span className="animation-editor__list-suffix">{initialSuffix}</span>
        </>
      )
    }
    return state.name
  },
  children: (state as Animation.GroupStateConfig)?.substates?.map(
    (substate) => parseSubstate(substate, state.id),
  ),
}))
