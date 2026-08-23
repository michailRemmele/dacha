import { CSSProperties, FC } from 'react';

import { Icon } from '../../../../components';
import { getEntityColorHue } from '../../../../../utils/component-color';

import { resolveIcon } from './resolve-icon';
import styles from './entity-icon.module.css';

export interface EntityIconProps {
  name: string;
  icon?: string;
}

export const EntityIcon: FC<EntityIconProps> = ({ name, icon }) => {
  const hue = getEntityColorHue(name);

  const resolvedIcon = icon ? resolveIcon(icon) : undefined;

  return (
    <span
      className={styles.badge}
      style={{ '--badge-hue': hue } as CSSProperties}
    >
      {resolvedIcon ? <Icon icon={resolvedIcon} size={16} /> : name[0]}
    </span>
  );
};
