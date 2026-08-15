import { useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'

import {
  InputField,
  LabelledTextInput,
  Form,
  ComponentList,
} from '../../components'
import type { FormComponentProps } from '../types'

export const TemplateForm: FC<FormComponentProps> = ({ path }) => {
  const { t } = useTranslation()

  const namePath = useMemo(() => path.concat('name'), [path])

  return (
    <Form>
      <InputField
        path={namePath}
        component={LabelledTextInput}
        label={t('inspector.templateForm.field.name.label')}
      />

      <ComponentList />
    </Form>
  )
}
