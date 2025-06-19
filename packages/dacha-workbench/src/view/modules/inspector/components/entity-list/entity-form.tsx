import { useMemo, FC } from 'react'
import { useTranslation, I18nextProvider } from 'react-i18next'

import { Widget } from '../widget'
import { CustomWidget } from '../custom-widget'

import { CONFIG_KEY_MAP } from './consts'
import type { Entity, EntityType } from './types'
import { EntityFormStyled } from './entity-list.style'

interface EntityFormProps extends Entity {
  path: string[]
  type: EntityType
}

export const EntityForm: FC<EntityFormProps> = ({ data, path, type }) => {
  const { t, i18n } = useTranslation()

  const { name, schema, namespace } = data

  const widgetPath = useMemo(
    () => path.concat(type, `name:${name}`, CONFIG_KEY_MAP[type]),
    [path, type, name],
  )

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
        path={widgetPath}
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
        path={widgetPath}
      />
    </I18nextProvider>
  )
}
