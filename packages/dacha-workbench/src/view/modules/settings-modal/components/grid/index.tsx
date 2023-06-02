import React, {
  useCallback,
  useContext,
  FC,
} from 'react'

import { EngineContext } from '../../../../providers'
import { SET_SETTINGS_VALUE_MSG } from '../../../../../consts/message-types'
import type { ModalComponentProps } from '../types'

import { StepField } from './step-field'
import { ColorField } from './color-field'
import { ShowGridField } from './show-grid-field'

import './style.less'

export const Grid: FC<ModalComponentProps> = ({ settings }) => {
  const { pushMessage } = useContext(EngineContext)

  const handleStepChange = useCallback((value: number): void => {
    pushMessage({
      type: SET_SETTINGS_VALUE_MSG,
      name: 'gridStep',
      value,
    })
  }, [])

  const handleColorChange = useCallback((value: string): void => {
    pushMessage({
      type: SET_SETTINGS_VALUE_MSG,
      name: 'gridColor',
      value,
    })
  }, [])

  const handleGridShowChange = useCallback((checked: boolean): void => {
    pushMessage({
      type: SET_SETTINGS_VALUE_MSG,
      name: 'showGrid',
      value: checked,
    })
  }, [])

  return (
    <div className="grid-settings">
      <StepField onChange={handleStepChange} value={settings.gridStep as number} />
      <ColorField onChange={handleColorChange} value={settings.gridColor as string} />
      <ShowGridField onChange={handleGridShowChange} value={settings.showGrid as boolean} />
    </div>
  )
}
