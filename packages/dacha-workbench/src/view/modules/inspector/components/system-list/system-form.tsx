import React, { FC } from 'react'

interface SystemPanelProps {
  entity: {
    id: string
    name: string
  }
}

export const SystemForm: FC<SystemPanelProps> = ({ entity }) => (
  <div>
    {JSON.stringify(entity)}
  </div>
)
