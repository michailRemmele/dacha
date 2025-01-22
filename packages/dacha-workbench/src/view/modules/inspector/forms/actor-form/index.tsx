import { useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { ActorConfig } from 'dacha'

import {
  Field,
  LabelledTextInput,
  Form,
  ComponentList,
} from '../../components'
import { useConfig } from '../../../../hooks'
import type { FormComponentProps } from '../types'

import { TemplateField } from './template-field'

export const ActorForm: FC<FormComponentProps> = ({ path }) => {
  const { t } = useTranslation()

  const namePath = useMemo(() => path.concat('name'), [path])

  const { templateId } = useConfig(path) as ActorConfig

  return (
    <Form>
      <Field
        path={namePath}
        component={LabelledTextInput}
        label={t('inspector.actorForm.field.name.label')}
      />
      {templateId ? (
        <TemplateField path={path} />
      ) : null}

      <ComponentList />
    </Form>
  )
}
