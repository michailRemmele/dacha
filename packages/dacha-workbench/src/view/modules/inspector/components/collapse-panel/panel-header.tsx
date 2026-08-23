import { FC } from 'react';

import { EntityIcon } from '../entity-icon';

import styles from './collapse-panel.module.css';

export interface PanelHeaderProps {
  title: string;
  icon?: string;
}

export const PanelHeader: FC<PanelHeaderProps> = ({ title, icon }) => (
  <span className={styles.headerLabel} title={title}>
    <EntityIcon name={title} icon={icon} />
    <span className={styles.title}>{title}</span>
  </span>
);
