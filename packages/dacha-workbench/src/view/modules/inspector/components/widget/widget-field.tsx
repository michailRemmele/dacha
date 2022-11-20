import React, { useContext, FC } from 'react'
import { useTranslation } from 'react-i18next'

import { EngineContext } from '../../../../providers'
import { Field } from '../field'
import { get, Data } from '../../../../utils/get'
import type { Field as FieldSchema, Reference } from '../../../../../types/widget-schema'

import { fieldTypes } from './field-types'
import { checkDependency } from './check-dependency'

interface WidgetFieldProps {
  field: FieldSchema
  path: Array<string>
  references?: Record<string, Reference | undefined>
}

export const WidgetField: FC<WidgetFieldProps> = ({ field, path, references }) => {
  const { t } = useTranslation()

  const { sceneContext } = useContext(EngineContext)

  const projectConfig = sceneContext.data.projectConfig as Data

  if (field.dependency) {
    const value = get(projectConfig, path.concat(field.dependency.name.split('.')))

    if (!checkDependency(value, field.dependency.value)) {
      return null
    }
  }

  return (
    <Field
      path={path.concat(field.name.split('.'))}
      label={t(field.title)}
      component={fieldTypes[field.type] ? fieldTypes[field.type] : fieldTypes.string}
      {...field.type === 'select' ? { referenceId: field.referenceId, references } : {}}
    />
  )
}
