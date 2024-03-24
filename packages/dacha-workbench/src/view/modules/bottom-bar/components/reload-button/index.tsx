import {
  useCallback,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Tooltip } from 'antd'
import { WarningOutlined } from '@ant-design/icons'

import { useSaveProject } from '../../../../hooks/use-save-project'
import { NeedsReloadContext } from '../../../../providers'

import { ReloadButtonCSS } from './reload-button.style'

export const ReloadButton: FC = () => {
  const { t } = useTranslation()
  const { needsReload } = useContext(NeedsReloadContext)
  const { save } = useSaveProject()

  const handleClick = useCallback(() => {
    save()
    window.location.reload()
  }, [])

  if (!needsReload) {
    return null
  }

  return (
    <Tooltip title={t('bottomBar.reloadWarning.button.tooltip')}>
      <Button
        css={ReloadButtonCSS}
        size="small"
        type="link"
        icon={<WarningOutlined />}
        onClick={handleClick}
      >
        {t('bottomBar.reloadWarning.button.title')}
      </Button>
    </Tooltip>
  )
}
