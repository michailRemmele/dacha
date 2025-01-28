import {
  useContext,
  FC,
} from 'react'

import { getStatePath } from '../../utils/paths'
import { useConfig } from '../../../../../../../../hooks'
import { AnimationEditorContext } from '../../providers'

import { List } from './list'
import { ActionBar } from './action-bar'

interface TransitionListProps {
  className?: string
}

export const TransitionList: FC<TransitionListProps> = ({
  className = '',
}) => {
  const { selectedEntity } = useContext(AnimationEditorContext)
  const statePath = selectedEntity ? getStatePath(selectedEntity.path) : undefined
  const state = useConfig(statePath)

  return (
    <div className={className}>
      <ActionBar />
      {!!state && <List />}
    </div>
  )
}
