import React, {
  useContext,
  FC,
} from 'react'
import { AnimationEditorContext } from '../../providers'

import { List } from './list'
import { ActionBar } from './action-bar'

interface TransitionListProps {
  className?: string
  onSelect: (id: string) => void
}

export const TransitionList: FC<TransitionListProps> = ({
  className = '',
  onSelect,
}) => {
  const { selectedState } = useContext(AnimationEditorContext)

  return (
    <div className={className}>
      <ActionBar />
      {selectedState && <List onSelect={onSelect} />}
    </div>
  )
}
