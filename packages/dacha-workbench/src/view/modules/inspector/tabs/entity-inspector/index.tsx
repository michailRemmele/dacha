import { useCallback, useContext, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Typography } from 'antd'
import { Copy } from '@gravity-ui/icons'
import { Icon } from '../../../../components'

import { InspectedEntityContext } from '../../../../providers'
import { useConfig } from '../../../../hooks'
import { forms } from '../../forms'

import { HeaderStyled } from './entity-inspector.style'

export const EntityInspector = (): ReactElement | null => {
  const { t } = useTranslation()
  const { type, path } = useContext(InspectedEntityContext)

  const entity = useConfig(path) as { id: string } | undefined
  const handleCopyId = useCallback(() => {
    if (!entity) {
      return
    }

    void navigator.clipboard.writeText(entity.id)
  }, [entity])

  const FormComponent = type ? forms[type] : null

  if (!FormComponent || !path) {
    return null
  }

  return (
    <>
      <HeaderStyled>
        <Typography.Text strong>
          {t(`inspector.entityInspector.${type as string}.title`)}
        </Typography.Text>
        <Button
          icon={<Icon icon={<Copy />} />}
          onClick={handleCopyId}
          title={t('inspector.entityInspector.copyIdButton.title')}
        />
      </HeaderStyled>
      <FormComponent path={path} />
    </>
  )
}
