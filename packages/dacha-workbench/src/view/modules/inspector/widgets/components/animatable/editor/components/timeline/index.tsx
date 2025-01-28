import {
  useContext,
  FC,
} from 'react'

import { getStatePath } from '../../utils/paths'
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
  const { selectedEntity } = useContext(AnimationEditorContext)
  const statePath = selectedEntity ? getStatePath(selectedEntity.path) : undefined
  const state = useConfig(statePath)

  return (
    <div className={className}>
      <ActionBar />
      <TimelineWrapperStyled>
        {!!state && <List />}
      </TimelineWrapperStyled>
    </div>
  )
}
