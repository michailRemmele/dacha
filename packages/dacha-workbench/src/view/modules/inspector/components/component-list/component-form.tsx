import React, { FC } from 'react'
import type { ComponentConfig } from 'remiz'

interface ComponentPanelProps {
  entity: ComponentConfig
}

export const ComponentForm: FC<ComponentPanelProps> = ({ entity }) => (
  <div>
    {JSON.stringify(entity.config)}
  </div>
)
