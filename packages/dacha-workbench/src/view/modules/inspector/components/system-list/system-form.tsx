import React, { FC } from 'react'

import type { Entity } from '../entity-list/types'

type SystemFormProps = Entity

export const SystemForm: FC<SystemFormProps> = ({ data }) => (
  <div>
    {JSON.stringify(data)}
  </div>
)
