import {
  useCallback,
  useState,
  useEffect,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import type { GameObject, MessageBus } from 'remiz'

import { Modal } from '../../components'
import { EngineContext } from '../../providers'
import { SET_SETTINGS_VALUE_MSG } from '../../../consts/message-types'
import type { Settings } from '../../../engine/components'

import { modals } from './components'

const SETTINGS_COMPONENT_NAME = 'settings'

export const SettingsModal: FC = () => {
  const { t } = useTranslation()
  const {
    sceneContext,
    messageBusObserver,
  } = useContext(EngineContext)

  const [open, setOpen] = useState(false)
  const [type, setType] = useState<string>()

  const handleEditorOpen = useCallback(() => setOpen(true), [])
  const handleEditorClose = useCallback(() => setOpen(false), [])

  const [settings, setSettings] = useState<Record<string, unknown>>()

  useEffect(() => {
    const handleSettingsMessage = (modalType: string): void => {
      setType(modalType)
      handleEditorOpen()
    }

    window.electron.onSettings(handleSettingsMessage)
  }, [])

  useEffect(() => {
    const updateSettings = (): void => {
      const mainObject = sceneContext.data.mainObject as GameObject
      const { data } = mainObject.getComponent(SETTINGS_COMPONENT_NAME) as Settings

      setSettings({ ...data })
    }

    const handleSettingsUpdate = (messageBus: unknown): void => {
      const messages = (messageBus as MessageBus).get(SET_SETTINGS_VALUE_MSG)
      if (messages === undefined || messages.length === 0) {
        return
      }

      updateSettings()
    }

    updateSettings()

    messageBusObserver.subscribe(handleSettingsUpdate)

    return () => messageBusObserver.unsubscribe(handleSettingsUpdate)
  }, [messageBusObserver])

  if (type === undefined || settings === undefined) {
    return null
  }

  const modal = modals[type]

  if (modal === undefined) {
    return null
  }

  const { component: Component, title } = modal

  return (
    <Modal
      title={t(title)}
      open={open}
      onCancel={handleEditorClose}
      width="300px"
    >
      <Component settings={settings} />
    </Modal>
  )
}
