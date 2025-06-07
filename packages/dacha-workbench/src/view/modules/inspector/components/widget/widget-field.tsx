import {
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'

import { Field } from '../field'
import { DependencyField } from '../dependency-field'
import type { Field as FieldSchema } from '../../../../../types/widget-schema'
import { formatWidgetName } from '../../../../../utils/format-widget-name'

import { fieldTypes } from './field-types'

interface WidgetFieldProps {
  field: FieldSchema
  path: string[]
}

export const WidgetField: FC<WidgetFieldProps> = ({ field, path }) => {
  const {
    name, type, title, dependency, initialValue, ...properties
  } = field

  const { t } = useTranslation()

  const dependencyPath = useMemo(
    () => (dependency ? path.concat(dependency.name.split('.')) : void 0),
    [path, dependency],
  )
  const fieldPath = useMemo(() => path.concat(name.split('.')), [path, name])

  if (dependency && dependencyPath) {
    return (
      <DependencyField
        path={fieldPath}
        label={title ? t(title) : formatWidgetName(name)}
        component={fieldTypes[type] ? fieldTypes[type] : fieldTypes.string}
        dependencyPath={dependencyPath}
        dependencyValue={dependency.value}
        {...properties}
      />
    )
  }

  return (
    <Field
      path={fieldPath}
      label={title ? t(title) : formatWidgetName(name)}
      component={fieldTypes[type] ? fieldTypes[type] : fieldTypes.string}
      {...properties}
    />
  )
}
