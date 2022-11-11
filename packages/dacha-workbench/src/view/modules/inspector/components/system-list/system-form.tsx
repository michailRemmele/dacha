import React, { FC } from 'react'
import type { SystemConfig } from 'remiz'

interface SystemPanelProps {
  entity: SystemConfig
}

export const SystemForm: FC<SystemPanelProps> = ({ entity }) => (
  <div>
    {JSON.stringify(entity.options)}
  </div>
)
