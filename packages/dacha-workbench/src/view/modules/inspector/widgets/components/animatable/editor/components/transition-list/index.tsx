import {
  useContext,
  FC,
} from 'react'

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
  const { selectedState } = useContext(AnimationEditorContext)
  const state = useConfig(selectedState)

  return (
    <div className={className}>
      <ActionBar />
      {!!state && <List />}
    </div>
  )
}
