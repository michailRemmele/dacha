import {
  useCallback,
  useState,
  useEffect,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import type { Actor } from 'dacha'

import { Modal } from '../../components'
import { EngineContext } from '../../providers'
import { Settings } from '../../../engine/components'
import { EventType } from '../../../events'

import { modals } from './components'

export const SettingsModal: FC = () => {
  const { t } = useTranslation()
  const { world } = useContext(EngineContext)

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
    const handleSettingsUpdate = (): void => {
      const mainActor = world.data.mainActor as Actor
      const { data } = mainActor.getComponent(Settings)

      setSettings({ ...data })
    }

    handleSettingsUpdate()

    world.addEventListener(EventType.SetSettingsValue, handleSettingsUpdate)

    return (): void => world.removeEventListener(EventType.SetSettingsValue, handleSettingsUpdate)
  }, [])

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
