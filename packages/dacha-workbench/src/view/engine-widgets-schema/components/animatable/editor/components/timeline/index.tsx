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
}

export const Timeline: FC<TimelineProps> = ({
  className = '',
}) => {
  const { selectedState } = useContext(AnimationEditorContext)

  return (
    <div className={className}>
      <ActionBar />
      <div className="timeline__wrapper">
        {selectedState && <List />}
      </div>
    </div>
  )
}
