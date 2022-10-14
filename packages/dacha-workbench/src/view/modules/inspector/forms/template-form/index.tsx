import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Field,
  LabelledTextInput,
  Form,
} from '../../components'
import type { FormComponentProps } from '../types'

export const TemplateForm: FC<FormComponentProps> = ({ path }) => {
  const { t } = useTranslation()

  return (
    <Form>
      <Field
        path={path.concat('name')}
        component={LabelledTextInput}
        label={t('inspector.templateForm.field.name.label')}
      />
      <Field
        path={path.concat('type')}
        component={LabelledTextInput}
        label={t('inspector.templateForm.field.type.label')}
      />
    </Form>
  )
}
