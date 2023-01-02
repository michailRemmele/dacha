import React, {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'

import { LabelledSelect } from '../select'
import { LabelledTextInput } from '../text-input'
import { LabelledNumberInput } from '../number-input'
import { useMutator } from '../../../../hooks'
import { LabelledCheckbox } from '../checkbox'
import { Panel } from '../panel'
import { NAMESPACE_EDITOR } from '../../../../providers/schemas-provider/consts'

import './style.less'

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
]

const TYPES_MAP = {
  string: LabelledTextInput,
  number: LabelledNumberInput,
  boolean: LabelledCheckbox,
}

type MultiFieldValues = Record<string, string | number | boolean>

type MultiFieldEntryType = 'string' | 'number' | 'boolean'

interface MultiFieldEntry {
  name: string
  type: MultiFieldEntryType
  value: string | number | boolean
}

interface MultiFieldProps {
  path: Array<string>
}

export const MultiField: FC<MultiFieldProps> = ({ path }) => {
  const { t } = useTranslation(NAMESPACE_EDITOR)

  const values = useMutator(path) as MultiFieldValues

  const entries = useMemo<Array<MultiFieldEntry>>(() => Object.keys(values).map((key) => ({
    name: key,
    type: typeof values[key] as MultiFieldEntryType,
    value: values[key],
  })), [values])

  const handleTypeChange = useCallback(() => {

  }, [])

  const handleNameChange = useCallback(() => {
    // TODO: Implement field name update
  }, [])

  const handleChangeValue = useCallback(() => {
    // TODO: Implement field value update
  }, [])

  const handleAddField = useCallback(() => {
    // TODO: Implement field addition
  }, [])

  const handleDeleteField = useCallback(() => {
    // TODO: Implement field deletion
  }, [])

  // Изменение типа поля кажется в стейте будет делаться
  return (
    <div className="multifield">
      {!entries.length && (
        <div className="multifield__no-fields">
          {t('inspector.multifield.noFields.title')}
        </div>
      )}
      {Boolean(entries.length) && (
        <ul className="multifield__fields">
          {entries.map((entry, index) => {
            // comment: It's hard to merge different Input types in one component
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const InputField = TYPES_MAP[entry.type] as FC<any>
            return (
              <li key={entry.name} className="multifield__field">
                <Panel
                  title={t('inspector.multifield.field.title', { index: index + 1 })}
                  onDelete={handleDeleteField}
                >
                  <LabelledTextInput
                    value={entry.name}
                    onChange={handleNameChange}
                    label={t('inspector.multifield.field.name.title')}
                  />
                  <LabelledSelect
                    options={TYPES}
                    value={entry.type}
                    onChange={handleTypeChange}
                    label={t('inspector.multifield.field.type.title')}
                  />
                  <InputField
                    value={entry.value}
                    onChange={handleChangeValue}
                    label={t('inspector.multifield.field.value.title')}
                  />
                </Panel>
              </li>
            )
          })}
        </ul>
      )}
      <Button
        className="multifield__button"
        size="small"
        onClick={handleAddField}
      >
        {t('inspector.multifield.addNew.value.title')}
      </Button>
    </div>
  )
}
