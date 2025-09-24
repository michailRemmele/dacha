import {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'

import { Field } from '../field'
import { LabelledSelect } from '../select'
import { LabelledTextInput } from '../text-input'
import { LabelledNumberInput } from '../number-input'
import { LabelledCheckbox } from '../checkbox'
import { LabelledMultiTextInput } from '../multi-text-input'
import { Panel } from '../panel'
import { useCommander } from '../../../../hooks'
import { deleteValue, setValue } from '../../../../commands'
import { NAMESPACE_EDITOR } from '../../../../providers/schemas-provider/consts'

import type { MultiFieldEntryType } from './types'

const TYPES = [
  {
    title: 'string',
    value: 'string',
  },
  {
    title: 'number',
    value: 'number',
  },
  {
    title: 'boolean',
    value: 'boolean',
  },
  {
    title: 'array',
    value: 'array',
  },
]

const TYPES_MAP = {
  string: LabelledTextInput,
  number: LabelledNumberInput,
  boolean: LabelledCheckbox,
  array: LabelledMultiTextInput,
}

const TYPES_INITIAL_VALUES_MAP = {
  string: '',
  number: 0,
  boolean: false,
  array: [],
}

interface MultiFieldEntryProps {
  path: string[]
  order: number
  id: string
  type: MultiFieldEntryType
}

export const Entry: FC<MultiFieldEntryProps> = ({
  path,
  id,
  order,
  type,
}) => {
  const { t } = useTranslation(NAMESPACE_EDITOR)
  const { dispatch } = useCommander()

  const entryPath = useMemo(() => path.concat(`id:${id}`), [path])
  const namePath = useMemo(() => entryPath.concat('name'), [entryPath])
  const typePath = useMemo(() => entryPath.concat('type'), [entryPath])
  const valuePath = useMemo(() => entryPath.concat('value'), [entryPath])

  const handleDeleteField = useCallback(() => {
    dispatch(deleteValue(entryPath))
  }, [dispatch, entryPath])

  const handleTypeChange = useCallback((newType: unknown) => {
    dispatch(
      setValue(valuePath, TYPES_INITIAL_VALUES_MAP[newType as MultiFieldEntryType], true),
    )
  }, [dispatch, valuePath])

  // comment: It's hard to merge different Input types in one component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const InputField = TYPES_MAP[type] as FC<any>

  return (
    <Panel
      size="small"
      title={t('inspector.multifield.field.title', { index: order + 1 })}
      onDelete={handleDeleteField}
    >
      <Field
        path={namePath}
        component={LabelledTextInput}
        label={t('inspector.multifield.field.name.title')}
      />
      <Field
        path={typePath}
        component={LabelledSelect}
        label={t('inspector.multifield.field.type.title')}
        options={TYPES}
        onAccept={handleTypeChange}
      />
      <Field
        // Reset component on type change to prevent issues with value mismatch
        key={type}
        path={valuePath}
        component={InputField}
        label={t('inspector.multifield.field.value.title')}
      />
    </Panel>
  )
}
