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
        name={path.concat('name').join('.')}
        component={LabelledTextInput}
        label={t('inspector.templateForm.field.name.label')}
      />
      <Field
        name={path.concat('type').join('.')}
        component={LabelledTextInput}
        label={t('inspector.templateForm.field.type.label')}
      />
    </Form>
  )
}
