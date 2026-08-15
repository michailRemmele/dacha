import {
  useCallback,
  useContext,
  FC,
} from 'react'

import { EngineContext } from '../../../../providers'
import type { ModalComponentProps } from '../types'
import { EventType } from '../../../../../events'

import { StepField } from './step-field'
import { ColorField } from './color-field'
import { ShowGridField } from './show-grid-field'
import { GridSettingsStyled } from './grid.style'

export const Grid: FC<ModalComponentProps> = ({ settings }) => {
  const { world } = useContext(EngineContext)

  const handleStepChange = useCallback((value: number): void => {
    world.dispatchEvent(EventType.SetSettingsValue, {
      name: 'gridStep',
      value,
    })
  }, [world])

  const handleColorChange = useCallback((value: string): void => {
    world.dispatchEvent(EventType.SetSettingsValue, {
      name: 'gridColor',
      value,
    })
  }, [world])

  const handleGridShowChange = useCallback((checked: boolean): void => {
    world.dispatchEvent(EventType.SetSettingsValue, {
      name: 'showGrid',
      value: checked,
    })
  }, [world])

  return (
    <GridSettingsStyled>
      <StepField onChange={handleStepChange} value={settings.gridStep as number} />
      <ColorField onChange={handleColorChange} value={settings.gridColor as string} />
      <ShowGridField onChange={handleGridShowChange} value={settings.showGrid as boolean} />
    </GridSettingsStyled>
  )
}
