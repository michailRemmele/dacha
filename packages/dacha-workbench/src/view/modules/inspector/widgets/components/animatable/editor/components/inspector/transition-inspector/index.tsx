import {
  useCallback,
  useMemo,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import type { Animation } from 'dacha'

import { FormStyled, FooterStyled, ButtonCSS } from '../inspector.style'
import {
  Field,
  LabelledNumberInput,
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

  const stateTransitionPath = useMemo(() => transitionPath.concat('state'), [transitionPath])
  const timePath = useMemo(() => transitionPath.concat('time'), [transitionPath])
  const conditionsPath = useMemo(() => transitionPath.concat('conditions'), [transitionPath])

  const states = useConfig(statesPath) as Array<Animation.StateConfig>
  const statesOptions = useMemo(() => states.map((state) => ({
    title: state.name,
    value: state.id,
  })), [states])

  const conditions = useConfig(conditionsPath) as Array<Animation.ConditionConfig>

  const handleAddCondition = useCallback(() => {
    dispatch(addValue(conditionsPath, {
      id: uuidv4(),
      type: CONDITION_TYPE.EVENT,
      props: {
        eventType: '',
      },
    }))
  }, [dispatch, conditionsPath])

  return (
    <FormStyled>
      <Field
        path={stateTransitionPath}
        component={LabelledSelect}
        label={t('components.animatable.editor.transition.state.title')}
        options={statesOptions}
      />
      <Field
        path={timePath}
        component={LabelledNumberInput}
        label={t('components.animatable.editor.transition.time.title')}
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
