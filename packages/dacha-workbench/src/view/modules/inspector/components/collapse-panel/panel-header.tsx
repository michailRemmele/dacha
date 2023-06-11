import { FC } from 'react'

export interface PanelHeaderProps {
  title: string
}

export const PanelHeader: FC<PanelHeaderProps> = ({ title }) => (
  <span title={title}>{title}</span>
)
