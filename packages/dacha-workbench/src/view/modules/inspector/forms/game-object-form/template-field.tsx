import React, { useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { TemplateConfig } from 'remiz'

import { LabelledTextInput } from '../../components'
import { useConfig } from '../../../../hooks'

interface TemplateFieldProps {
  id: string
}

export const TemplateField: FC<TemplateFieldProps> = ({ id }) => {
  const { t } = useTranslation()

  const templatePath = useMemo(() => ['templates', `id:${id}`], [id])
  const { name } = useConfig(templatePath) as TemplateConfig

  return (
    <LabelledTextInput
      label={t('inspector.gameObjectForm.field.templateName.label')}
      value={name}
      disabled
    />
  )
}
