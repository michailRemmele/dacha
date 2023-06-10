import {
  useContext,
  FC,
} from 'react'

import { AnimationEditorContext } from '../../providers'

import { ActionBar } from './action-bar'
import { List } from './list'

import { TimelineWrapperStyled } from './timeline.style'

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
      <TimelineWrapperStyled>
        {selectedState && <List />}
      </TimelineWrapperStyled>
    </div>
  )
}
