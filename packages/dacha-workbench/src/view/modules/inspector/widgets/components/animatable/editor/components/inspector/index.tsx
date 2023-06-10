import {
  useContext,
  FC,
} from 'react'
import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import { AnimationEditorContext } from '../../providers'

import { StateInspector } from './state-inspector'
import { SubstateInspector } from './substate-inspector'
import { TransitionInspector } from './transition-inspector'
import { FrameInspector } from './frame-inspector'

import {
  InspectorStyled,
  HeaderStyled,
  InspectorContentStyled,
} from './inspector.style'

export const Inspector: FC = () => {
  const { t } = useTranslation()
  const { selectedEntity } = useContext(AnimationEditorContext)

  return (
    <InspectorStyled>
      <HeaderStyled>
        {selectedEntity && (
          <Typography.Text strong>
            {t(`components.animatable.editor.inspector.${selectedEntity.type as string}.title`)}
          </Typography.Text>
        )}
      </HeaderStyled>
      {selectedEntity && (
        <InspectorContentStyled>
          {selectedEntity.type === 'state' && <StateInspector />}
          {selectedEntity.type === 'transition' && <TransitionInspector />}
          {selectedEntity.type === 'frame' && <FrameInspector />}
          {selectedEntity.type === 'substate' && <SubstateInspector />}
        </InspectorContentStyled>
      )}
    </InspectorStyled>
  )
}
