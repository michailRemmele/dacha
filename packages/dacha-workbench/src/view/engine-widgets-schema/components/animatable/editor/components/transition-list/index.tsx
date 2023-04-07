import React, {
  useContext,
  FC,
} from 'react'
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

  return (
    <div className={className}>
      <ActionBar />
      {selectedState && <List />}
    </div>
  )
}
