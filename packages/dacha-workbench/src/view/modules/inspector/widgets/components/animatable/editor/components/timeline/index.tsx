import {
  useContext,
  FC,
} from 'react'

import { useConfig } from '../../../../../../../../hooks'
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
  const state = useConfig(selectedState)

  return (
    <div className={className}>
      <ActionBar />
      <TimelineWrapperStyled>
        {!!state && <List />}
      </TimelineWrapperStyled>
    </div>
  )
}
