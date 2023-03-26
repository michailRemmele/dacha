import React, {
  useCallback,
  useMemo,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import type { Animation } from 'remiz'

import {
  Field,
  LabelledNumberInput,
  LabelledSelect,
} from '../../../../../../../modules/inspector/components'
import { useConfig, useCommander } from '../../../../../../../hooks'
import { deleteValue, addValue } from '../../../../../../../commands'
import { AnimationEditorContext } from '../../../providers'
import { CONDITION_TYPE } from '../../../const'

import { Condition } from './condition'

import './style.less'

export const TransitionInspector: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()
  const {
    path,
    selectedState,
    selectedTransition,
    selectEntity,
    setTransition,
  } = useContext(AnimationEditorContext)
  const id = selectedTransition as string

  const statesPath = useMemo(() => path.concat('states'), [path])
  const statePath = useMemo(
    () => statesPath.concat(`id:${selectedState as string}`),
    [statesPath, selectedState],
  )
  const transitionPath = useMemo(
    () => statePath.concat('transitions', `id:${id}`),
    [statePath, id],
  )

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
      type: CONDITION_TYPE.MESSAGE,
      props: {
        message: '',
      },
    }))
  }, [dispatch, conditionsPath])

  const handleDelete = useCallback(() => {
    selectEntity()
    setTransition()
    dispatch(deleteValue(transitionPath))
  }, [dispatch, selectEntity, setTransition, transitionPath])

  return (
    <form className="animation-inspector__form">
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

      <ul className="animation-inspector__conditions">
        {conditions.map((condition, index) => (
          <li className="animation-inspector__condition" key={condition.id}>
            <Condition
              path={conditionsPath}
              id={condition.id}
              order={index}
            />
          </li>
        ))}
      </ul>

      <footer className="animation-inspector__footer">
        <Button
          className="animation-inspector__button"
          size="small"
          onClick={handleAddCondition}
        >
          {t('components.animatable.editor.condition.add.button.title')}
        </Button>

        <Button
          className="animation-inspector__button"
          size="small"
          onClick={handleDelete}
        >
          {t('components.animatable.editor.transition.delete.button.title')}
        </Button>
      </footer>
    </form>
  )
}
