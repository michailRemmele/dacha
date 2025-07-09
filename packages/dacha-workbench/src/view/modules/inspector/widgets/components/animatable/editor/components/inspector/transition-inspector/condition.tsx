import {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import type { Animation } from 'dacha'

import {
  DependencyField,
  LabelledTextInput,
  LabelledSelect,
  Panel,
} from '../../../../../../../components'
import { useConfig, useCommander, useExtension } from '../../../../../../../../../hooks'
import { deleteValue, setValue } from '../../../../../../../../../commands'
import { COMPARATOR_VALUE, CONDITION_TYPE } from '../../../const'

import { conditionTypes } from './condition-types'
import {
  comparatorValues,
  COMPARATOR_TYPES_MAP,
  COMPARATOR_INITIAL_VALUES_MAP,
} from './comparator-values'
import { operationTypes } from './operation-types'

type ArgType = Animation.ComparatorConditionArg['type']

export interface ConditionProps {
  path: Array<string>
  id: string
  order: number
}

export const Condition: FC<ConditionProps> = ({
  path,
  id,
  order,
}) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()
  const { events } = useExtension()

  const conditionPath = useMemo(() => path.concat(`id:${id}`), [id, path])
  const typePath = useMemo(() => conditionPath.concat('type'), [conditionPath])
  const propsPath = useMemo(() => conditionPath.concat('props'), [conditionPath])
  const eventTypePath = useMemo(() => propsPath.concat('eventType'), [propsPath])
  const arg1TypePath = useMemo(() => propsPath.concat('arg1', 'type'), [propsPath])
  const arg1ValuePath = useMemo(() => propsPath.concat('arg1', 'value'), [propsPath])
  const arg2TypePath = useMemo(() => propsPath.concat('arg2', 'type'), [propsPath])
  const arg2ValuePath = useMemo(() => propsPath.concat('arg2', 'value'), [propsPath])
  const operationPath = useMemo(() => propsPath.concat('operation'), [propsPath])

  const condition = useConfig(conditionPath) as Animation.ConditionConfig
  const { arg1, arg2 } = condition.props as unknown as Animation.ComparatorConditionPropsConfig

  const handleTypeChange = useCallback((value: unknown) => {
    const { props, ...otherCondition } = condition

    if (value === CONDITION_TYPE.EVENT) {
      dispatch(setValue(conditionPath, {
        ...otherCondition,
        type: value,
        props: {
          eventType: '',
        },
      }))
    } else {
      dispatch(setValue(conditionPath, {
        ...otherCondition,
        type: value,
        props: {
          arg1: { type: COMPARATOR_VALUE.NUMBER, value: 0 },
          arg2: { type: COMPARATOR_VALUE.NUMBER, value: 0 },
          operation: 'equals',
        },
      }))
    }
  }, [dispatch, conditionPath, condition])

  const handleArg1TypeChange = useCallback((value: unknown) => {
    dispatch(
      setValue(arg1ValuePath, COMPARATOR_INITIAL_VALUES_MAP[value as ArgType], true),
    )
  }, [dispatch, arg1ValuePath])

  const handleArg2TypeChange = useCallback((value: unknown) => {
    dispatch(
      setValue(arg2ValuePath, COMPARATOR_INITIAL_VALUES_MAP[value as ArgType], true),
    )
  }, [dispatch, arg2ValuePath])

  const handleDeleteBind = useCallback(() => {
    dispatch(deleteValue(conditionPath))
  }, [dispatch, conditionPath])

  return (
    <Panel
      title={t('components.animatable.editor.condition.title', { index: order + 1 })}
      onDelete={handleDeleteBind}
    >
      <LabelledSelect
        label={t('components.animatable.editor.condition.type.title')}
        options={conditionTypes}
        onChange={handleTypeChange}
        value={condition.type}
      />

      <DependencyField
        path={eventTypePath}
        component={events ? LabelledSelect : LabelledTextInput}
        label={t('components.animatable.editor.condition.eventType.title')}
        options={events}
        dependencyPath={typePath}
        dependencyValue={CONDITION_TYPE.EVENT}
        deleteOnHide={false}
      />

      <DependencyField
        path={arg1TypePath}
        component={LabelledSelect}
        label={t('components.animatable.editor.condition.arg1.type.title')}
        options={comparatorValues}
        onAccept={handleArg1TypeChange}
        dependencyPath={typePath}
        dependencyValue={CONDITION_TYPE.COMPARATOR}
        deleteOnHide={false}
      />
      <DependencyField
        path={arg1ValuePath}
        component={COMPARATOR_TYPES_MAP[arg1?.type ?? COMPARATOR_VALUE.COMPONENT_VALUE]}
        label={t('components.animatable.editor.condition.arg1.value.title')}
        dependencyPath={typePath}
        dependencyValue={CONDITION_TYPE.COMPARATOR}
        deleteOnHide={false}
      />

      <DependencyField
        path={operationPath}
        component={LabelledSelect}
        label={t('components.animatable.editor.condition.operation.title')}
        options={operationTypes}
        dependencyPath={typePath}
        dependencyValue={CONDITION_TYPE.COMPARATOR}
        deleteOnHide={false}
      />

      <DependencyField
        path={arg2TypePath}
        component={LabelledSelect}
        label={t('components.animatable.editor.condition.arg2.type.title')}
        options={comparatorValues}
        onAccept={handleArg2TypeChange}
        dependencyPath={typePath}
        dependencyValue={CONDITION_TYPE.COMPARATOR}
        deleteOnHide={false}
      />
      <DependencyField
        path={arg2ValuePath}
        component={COMPARATOR_TYPES_MAP[arg2?.type ?? COMPARATOR_VALUE.COMPONENT_VALUE]}
        label={t('components.animatable.editor.condition.arg2.value.title')}
        dependencyPath={typePath}
        dependencyValue={CONDITION_TYPE.COMPARATOR}
        deleteOnHide={false}
      />
    </Panel>
  )
}
