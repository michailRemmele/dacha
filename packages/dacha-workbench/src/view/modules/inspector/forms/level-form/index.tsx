import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Field,
  LabelledTextInput,
  Form,
} from '../../components'

export const LevelForm: FC = () => {
  const { t } = useTranslation()

  return (
    <Form>
      <Field
        name="name"
        component={LabelledTextInput}
        label={t('inspector.levelForm.field.name.label')}
      />
    </Form>
  )
}
