import {
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'

import { Field } from '../field'
import { DependencyField } from '../dependency-field'
import type { Field as FieldSchema } from '../../../../../types/widget-schema'
import { formatWidgetName } from '../../../../../utils/format-widget-name'
import { resolveFieldInitialValue } from '../../../../../schema'

import { fieldTypes } from './field-types'
import { fieldValueValidators } from './field-value-validators'

interface WidgetFieldProps {
  field: FieldSchema
  path: string[]
}

export const WidgetField: FC<WidgetFieldProps> = ({ field, path }) => {
  const { t } = useTranslation()

  const dependencyPath = useMemo(() => {
    if (field.type === 'data' || field.dependency === undefined) {
      return void 0
    }
    return path.concat(field.dependency.name.split('.'))
  }, [path, field])
  const fieldPath = useMemo(() => path.concat(field.name.split('.')), [path, field.name])

  // data fields hold arbitrary non-primitive state and are never rendered generically
  if (field.type === 'data') {
    return null
  }

  const {
    name, type, title, dependency, initialValue, ...properties
  } = field

  if (dependency && dependencyPath) {
    return (
      <DependencyField
        path={fieldPath}
        label={title ? t(title) : formatWidgetName(name)}
        component={fieldTypes[type] ? fieldTypes[type] : fieldTypes.string}
        dependencyPath={dependencyPath}
        dependencyValue={dependency.value}
        initialValue={resolveFieldInitialValue(field)}
        isValueValid={fieldValueValidators[type]}
        {...properties}
      />
    )
  }

  return (
    <Field
      path={fieldPath}
      label={title ? t(title) : formatWidgetName(name)}
      component={fieldTypes[type] ? fieldTypes[type] : fieldTypes.string}
      isValueValid={fieldValueValidators[type]}
      {...properties}
    />
  )
}
