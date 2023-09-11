import { useContext, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'

import { NotificationContext } from '../../providers'
import { useSaveProject } from '../use-save-project'

const ReloadButton = (): JSX.Element => {
  const { t } = useTranslation()
  const { save } = useSaveProject()

  const handleReload = useCallback(() => {
    save()
    window.location.reload()
  }, [save])
  return (
    <Button onClick={handleReload}>
      {t('system.notification.reload.button.title')}
    </Button>
  )
}

export const useReloadNotification = (): () => void => {
  const notificationApi = useContext(NotificationContext)
  const { t } = useTranslation()

  const show = useCallback(() => {
    notificationApi.warning({
      key: 'reload-warning-notification',
      message: t('system.notification.reload.message'),
      description: t('system.notification.reload.description'),
      placement: 'bottomRight',
      btn: <ReloadButton />,
      duration: 0,
    })
  }, [])

  return show
}
