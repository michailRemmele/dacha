import React, {
  useContext,
  FC,
} from 'react'

import { AnimationEditorContext } from '../../providers'

import { ActionBar } from './action-bar'
import { List } from './list'

import './style.less'

interface TimelineProps {
  className?: string
  onSelect?: (id: string) => void
}

export const Timeline: FC<TimelineProps> = ({
  className = '',
  onSelect = (): void => void 0,
}) => {
  const { selectedState } = useContext(AnimationEditorContext)

  return (
    <div className={className}>
      <ActionBar />
      <div className="timeline__wrapper">
        {selectedState && <List onSelect={onSelect} />}
      </div>
    </div>
  )
}
