import React, {
  useContext,
  FC,
} from 'react'
import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import { cn } from '../../../../../../../../utils/cn'
import { AnimationEditorContext } from '../../providers'

import { StateInspector } from './state-inspector'
import { SubstateInspector } from './substate-inspector'
import { TransitionInspector } from './transition-inspector'
import { FrameInspector } from './frame-inspector'

import './style.less'

interface InspectorProps {
  className?: string
}

export const Inspector: FC<InspectorProps> = ({
  className,
}) => {
  const { t } = useTranslation()
  const { selectedEntity } = useContext(AnimationEditorContext)

  return (
    <div className={cn('animation-inspector', className)}>
      <header className="animation-inspector__header">
        {selectedEntity && (
          <Typography.Text strong>
            {t(`components.animatable.editor.inspector.${selectedEntity.type as string}.title`)}
          </Typography.Text>
        )}
      </header>
      {selectedEntity && (
        <div className="animation-inspector__content">
          {selectedEntity.type === 'state' && <StateInspector />}
          {selectedEntity.type === 'transition' && <TransitionInspector />}
          {selectedEntity.type === 'frame' && <FrameInspector />}
          {selectedEntity.type === 'substate' && <SubstateInspector />}
        </div>
      )}
    </div>
  )
}
