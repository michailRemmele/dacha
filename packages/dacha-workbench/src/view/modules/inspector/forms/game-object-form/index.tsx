import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { GameObjectConfig } from 'remiz'

import {
  Field,
  LabelledTextInput,
  Form,
  ComponentList,
} from '../../components'
import type { FormComponentProps } from '../types'

export const GameObjectForm: FC<FormComponentProps> = ({ path, entity }) => {
  const { t } = useTranslation()

  const { templateName } = (entity as GameObjectConfig)

  return (
    <Form>
      <Field
        path={path.concat('name')}
        component={LabelledTextInput}
        label={t('inspector.gameObjectForm.field.name.label')}
      />
      {templateName ? (
        <Field
          path={path.concat('templateName')}
          component={LabelledTextInput}
          label={t('inspector.gameObjectForm.field.templateName.label')}
          disabled
        />
      ) : null}
      <Field
        path={path.concat('type')}
        component={LabelledTextInput}
        label={t('inspector.gameObjectForm.field.type.label')}
      />

      <ComponentList />
    </Form>
  )
}
