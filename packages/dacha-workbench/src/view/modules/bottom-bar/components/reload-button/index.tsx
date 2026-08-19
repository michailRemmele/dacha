import {
  useCallback,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'antd'
import { TriangleExclamation } from '@gravity-ui/icons'
import { Icon } from '../../../../components'

import { useSaveProject } from '../../../../hooks/use-save-project'
import { NeedsReloadContext } from '../../../../providers'

import styles from './reload-button.module.css'

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
      <button type="button" className={styles.reloadButton} onClick={handleClick}>
        <Icon className={styles.icon} icon={<TriangleExclamation />} />
        {t('bottomBar.reloadWarning.button.title')}
      </button>
    </Tooltip>
  )
}
