import {
  useContext,
  FC,
} from 'react'
import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import { useConfig } from '../../../../../../../../hooks'
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

  const entity = useConfig(selectedEntity?.path)

  return (
    <InspectorStyled>
      <HeaderStyled>
        {!!entity && (
          <Typography.Text strong>
            {t(`components.animatable.editor.inspector.${selectedEntity?.type as string}.title`)}
          </Typography.Text>
        )}
      </HeaderStyled>
      {!!entity && (
        <InspectorContentStyled>
          {selectedEntity?.type === 'state' && <StateInspector />}
          {selectedEntity?.type === 'transition' && <TransitionInspector />}
          {selectedEntity?.type === 'frame' && <FrameInspector />}
          {selectedEntity?.type === 'substate' && <SubstateInspector />}
        </InspectorContentStyled>
      )}
    </InspectorStyled>
  )
}
