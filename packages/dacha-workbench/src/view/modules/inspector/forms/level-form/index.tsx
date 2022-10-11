import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Field,
  LabelledTextInput,
  Form,
} from '../../components'
import type { FormComponentProps } from '../types'

export const LevelForm: FC<FormComponentProps> = ({ path }) => {
  const { t } = useTranslation()

  return (
    <Form>
      <Field
        name={path.concat('name').join('.')}
        component={LabelledTextInput}
        label={t('inspector.levelForm.field.name.label')}
      />
    </Form>
  )
}
