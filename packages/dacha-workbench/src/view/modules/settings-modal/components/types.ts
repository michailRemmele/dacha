import type { SettingsConfig } from '../../../../engine/components/settings'

export interface ModalComponentProps {
  settings: Record<keyof SettingsConfig, unknown>
}
