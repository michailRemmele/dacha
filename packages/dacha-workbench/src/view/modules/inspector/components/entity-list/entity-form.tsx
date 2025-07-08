import type { FC } from 'react'
import { useTranslation, I18nextProvider } from 'react-i18next'

import { Widget } from '../widget'
import { CustomWidget } from '../custom-widget'

import type { Entity } from './types'
import { EntityFormStyled } from './entity-list.style'

interface EntityFormProps extends Entity {
  path: string[]
}

export const EntityForm: FC<EntityFormProps> = ({ data, path }) => {
  const { t, i18n } = useTranslation()

  const { schema, namespace } = data

  if (!schema || !namespace) {
    return (
      <EntityFormStyled>
        {t('inspector.entityList.content.noSchema.title')}
      </EntityFormStyled>
    )
  }

  if (schema.view) {
    return (
      <CustomWidget
        fields={schema.fields || []}
        path={path}
        component={schema.view}
        namespace={namespace}
      />
    )
  }

  if (!schema.fields || schema.fields.length === 0) {
    return (
      <EntityFormStyled>
        {t('inspector.entityList.content.empty.title')}
      </EntityFormStyled>
    )
  }

  return (
    <I18nextProvider i18n={i18n} defaultNS={namespace}>
      <Widget
        fields={schema.fields}
        path={path}
      />
    </I18nextProvider>
  )
}
