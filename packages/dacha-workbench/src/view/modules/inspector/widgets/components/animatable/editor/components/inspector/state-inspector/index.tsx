import {
  useCallback,
  useMemo,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import type { Animation } from 'dacha'

import { FormStyled } from '../inspector.style'
import {
  Field,
  DependencyField,
  LabelledTextInput,
  LabelledCheckbox,
  LabelledNumberInput,
  LabelledSelect,
} from '../../../../../../../components'
import { useConfig, useCommander } from '../../../../../../../../../hooks'
import { setValue } from '../../../../../../../../../commands'
import { AnimationEditorContext } from '../../../providers'
import { PICK_MODE, STATE_TYPE } from '../../../const'

import { types } from './types'
import { pickModes } from './pick-modes'

export const StateInspector: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()
  const { inspectedEntity } = useContext(AnimationEditorContext)

  const statePath = inspectedEntity?.path as string[]
  const state = useConfig(statePath) as Animation.StateConfig

  const namePath = useMemo(() => statePath.concat('name'), [statePath])
  const speedPath = useMemo(() => statePath.concat('speed'), [statePath])
  const typePath = useMemo(() => statePath.concat('type'), [statePath])
  const loopedPath = useMemo(() => statePath.concat('timeline', 'looped'), [statePath])
  const pickModePath = useMemo(() => statePath.concat('pickMode'), [statePath])
  const xPath = useMemo(() => statePath.concat('pickProps', 'x'), [statePath])
  const yPath = useMemo(() => statePath.concat('pickProps', 'y'), [statePath])

  const substatesPath = useMemo(() => statePath.concat('substates'), [statePath])

  const typeOptions = useMemo(
    () => types.map(({ value, title }) => ({ value, title: t(title) })),
    [],
  )
  const pickModeOptions = useMemo(
    () => pickModes.map(({ value, title }) => ({ value, title: t(title) })),
    [],
  )

  const handleTypeChange = useCallback((value: unknown) => {
    const {
      substates,
      pickProps,
      pickMode,
      timeline,
      ...otherState
    } = state as Animation.GroupStateConfig & Animation.IndividualStateConfig

    if (value === STATE_TYPE.INDIVIDUAL) {
      dispatch(setValue(statePath, {
        ...otherState,
        type: value,
        timeline: { frames: [], looped: false },
      }))
    } else {
      dispatch(setValue(statePath, {
        ...otherState,
        type: value,
        substates: [],
        pickMode: '1D',
        pickProps: { x: '' },
      }))
    }
  }, [dispatch, state, statePath])

  const handlePickModeChange = useCallback((value: unknown) => {
    const { substates } = state as Animation.GroupStateConfig & Animation.IndividualStateConfig

    if (value === PICK_MODE.ONE_DIMENSIONAL) {
      dispatch(
        setValue(substatesPath, substates.map(({ y, ...substate }) => substate), true),
      )
    }
    if (value === PICK_MODE.TWO_DIMENSIONAL) {
      dispatch(
        setValue(substatesPath, substates.map((substate) => ({ ...substate, y: 0 })), true),
      )
    }
  }, [dispatch, state, substatesPath])

  return (
    <FormStyled>
      <Field
        path={namePath}
        component={LabelledTextInput}
        label={t('components.animatable.editor.state.name.title')}
      />
      <Field
        path={speedPath}
        component={LabelledNumberInput}
        label={t('components.animatable.editor.state.speed.title')}
      />
      <LabelledSelect
        label={t('components.animatable.editor.state.type.title')}
        options={typeOptions}
        onChange={handleTypeChange}
        value={state.type}
      />

      <DependencyField
        path={loopedPath}
        component={LabelledCheckbox}
        label={t('components.animatable.editor.state.looped.title')}
        dependencyPath={typePath}
        dependencyValue={STATE_TYPE.INDIVIDUAL}
        deleteOnHide={false}
      />
      <DependencyField
        path={pickModePath}
        component={LabelledSelect}
        label={t('components.animatable.editor.state.pickMode.title')}
        options={pickModeOptions}
        onAccept={handlePickModeChange}
        dependencyPath={typePath}
        dependencyValue={STATE_TYPE.GROUP}
        deleteOnHide={false}
      />

      <DependencyField
        path={xPath}
        component={LabelledTextInput}
        label={t('components.animatable.editor.state.pickProps.x.title')}
        dependencyPath={pickModePath}
        dependencyValue={`${PICK_MODE.ONE_DIMENSIONAL}|${PICK_MODE.TWO_DIMENSIONAL}`}
        deleteOnHide={false}
      />
      <DependencyField
        path={yPath}
        component={LabelledTextInput}
        label={t('components.animatable.editor.state.pickProps.y.title')}
        dependencyPath={pickModePath}
        dependencyValue={PICK_MODE.TWO_DIMENSIONAL}
      />
    </FormStyled>
  )
}
