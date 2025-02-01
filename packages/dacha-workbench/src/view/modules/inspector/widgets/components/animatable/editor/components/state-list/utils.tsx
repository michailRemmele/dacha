import type { ReactNode } from 'react'
import type { Animation } from 'dacha'
import type { DataNode } from 'antd/lib/tree'

import type { InspectedEntity } from '../../types'
import { getStatePath, getSubstatePath } from '../../utils/paths'

import {
  ListItemInitialStyled,
  ListItemSuffixStyled,
} from './state-list.style'

export interface StateDataNode extends DataNode {
  parent?: StateDataNode
  path: Array<string>
}

const parseSubstate = (
  {
    id,
    name,
    x,
    y,
  }: Animation.SubstateConfig,
  path: Array<string>,
  parent: StateDataNode,
): StateDataNode => ({
  key: id,
  title: `${name} (x: ${x}${y !== undefined ? `, y: ${y}` : ''})`,
  isLeaf: true,
  parent,
  path: path.concat('substates', `id:${id}`),
})

export const parseStates = (
  states: Array<Animation.StateConfig>,
  path: Array<string>,
  initialState: string,
  initialSuffix: string,
): Array<StateDataNode> => states.map((state) => {
  const statePath = path.concat('states', `id:${state.id}`)

  const node: StateDataNode = {
    key: state.id,
    title: (): ReactNode => {
      if (state.id === initialState) {
        return (
          <>
            <ListItemInitialStyled>{state.name}</ListItemInitialStyled>
            <ListItemSuffixStyled>{initialSuffix}</ListItemSuffixStyled>
          </>
        )
      }
      return state.name
    },
    path: statePath,
  }

  node.children = (state as Animation.GroupStateConfig)?.substates?.map(
    (substate) => parseSubstate(substate, statePath, node),
  )

  return node
})

export const getSelectedPaths = (
  paths: string[][],
  inspectedEntity?: InspectedEntity,
): string[][] => {
  const selectedPaths = paths.filter((path) => path.at(-2) === 'states' || path.at(-2) === 'substates')

  if (!selectedPaths.length && (inspectedEntity?.type === 'transition' || inspectedEntity?.type === 'frame')) {
    const statePath = getStatePath(inspectedEntity.path)
    const substatePath = getSubstatePath(inspectedEntity.path)
    const selectedPath = substatePath ?? statePath
    return selectedPath ? [selectedPath] : []
  }

  return selectedPaths
}
