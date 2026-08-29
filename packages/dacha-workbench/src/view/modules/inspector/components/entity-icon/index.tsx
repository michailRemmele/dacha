import { CSSProperties, FC } from 'react';

import { Icon } from '../../../../components';
import { getEntityColorHue } from '../../../../../utils/component-color';
import { cx } from '../../../../../utils/cx';

import { resolveIcon } from './resolve-icon';
import styles from './entity-icon.module.css';

export interface EntityIconProps {
  name: string;
  icon?: string;
  background?: boolean;
}

export const EntityIcon: FC<EntityIconProps> = ({
  name,
  icon,
  background = true,
}) => {
  const hue = getEntityColorHue(name);

  const resolvedIcon = icon ? resolveIcon(icon) : undefined;

  return (
    <span
      className={cx(styles.badge, !background && styles.plain)}
      style={{ '--badge-hue': hue } as CSSProperties}
    >
      {resolvedIcon ? <Icon icon={resolvedIcon} size={16} /> : name[0]}
    </span>
  );
};
