import React, { useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Typography } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

import { SelectedEntityContext } from '../../../../providers'
import { useConfig } from '../../../../hooks'
import { forms } from '../../forms'

import './style.less'

export const EntityInspector = (): JSX.Element | null => {
  const { t } = useTranslation()
  const { type, path = [] } = useContext(SelectedEntityContext)

  const entity = useConfig(path) as { id: string }
  const handleCopyId = useCallback(() => {
    void navigator.clipboard.writeText(entity.id)
  }, [entity])

  const FormComponent = type ? forms[type] : null

  if (!FormComponent) {
    return null
  }

  return (
    <>
      <header className="entity-inspector__header">
        <Typography.Text strong>
          {t(`inspector.entityInspector.${type as string}.title`)}
        </Typography.Text>
        <Button
          icon={<CopyOutlined />}
          size="small"
          onClick={handleCopyId}
          title={t('inspector.entityInspector.copyIdButton.title')}
        />
      </header>
      <FormComponent path={path} />
    </>
  )
}
