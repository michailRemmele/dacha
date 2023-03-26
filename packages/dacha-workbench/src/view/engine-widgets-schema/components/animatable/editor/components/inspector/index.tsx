import React, { FC } from 'react'

import { cn } from '../../../../../../utils/cn'
import type { EntityType } from '../../types'

import { StateInspector } from './state-inspector'
import { SubstateInspector } from './substate-inspector'
import { TransitionInspector } from './transition-inspector'
import { FrameInspector } from './frame-inspector'

import './style.less'

interface InspectorProps {
  className?: string
  entityType: EntityType
}

export const Inspector: FC<InspectorProps> = ({
  className,
  entityType,
}) => {
  if (!entityType) {
    return null
  }

  return (
    <div className={cn('animation-inspector', className)}>
      {entityType === 'state' && <StateInspector />}
      {entityType === 'transition' && <TransitionInspector />}
      {entityType === 'frame' && <FrameInspector />}
      {entityType === 'substate' && <SubstateInspector />}
    </div>
  )
}
