import {
  useCallback,
  useMemo,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { uuid } from '../../../../../../../../../../utils/uuid'
import type { Animation } from 'dacha'

import { FormStyled, FooterStyled, ButtonCSS } from '../inspector.style'
import {
  Field,
  LabelledSelect,
} from '../../../../../../../components'
import { useConfig, useCommander } from '../../../../../../../../../hooks'
import { addValue } from '../../../../../../../../../commands'
import { AnimationEditorContext } from '../../../providers'
import { CONDITION_TYPE } from '../../../const'

import { Condition } from './condition'
import { ConditionsStyled, ConditionStyled } from './transition-inspector.style'

export const TransitionInspector: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()
  const { path, inspectedEntity } = useContext(AnimationEditorContext)

  const statesPath = useMemo(() => path.concat('states'), [path])
  const transitionPath = inspectedEntity?.path as string[]

  const conditionsPath = useMemo(() => transitionPath.concat('conditions'), [transitionPath])

  const states = useConfig(statesPath) as Animation.StateConfig[]
  const statesOptions = useMemo(() => states.map((state) => ({
    title: state.name,
    value: state.id,
  })), [states])

  const conditions = useConfig(conditionsPath) as Animation.ConditionConfig[]

  const handleAddCondition = useCallback(() => {
    dispatch(addValue(conditionsPath, {
      id: uuid(),
      type: CONDITION_TYPE.EVENT,
      props: {
        eventType: '',
      },
    }))
  }, [dispatch, conditionsPath])

  return (
    <FormStyled>
      <Field
        name="state"
        component={LabelledSelect}
        options={statesOptions}
        path={transitionPath}
      />
      <Field
        name="time"
        type="number"
        path={transitionPath}
      />

      <ConditionsStyled>
        {conditions.map((condition, index) => (
          <ConditionStyled key={condition.id}>
            <Condition
              path={conditionsPath}
              id={condition.id}
              order={index}
            />
          </ConditionStyled>
        ))}
      </ConditionsStyled>

      <FooterStyled>
        <Button
          css={ButtonCSS}
          size="small"
          onClick={handleAddCondition}
        >
          {t('components.animatable.editor.condition.add.button.title')}
        </Button>
      </FooterStyled>
    </FormStyled>
  )
}
