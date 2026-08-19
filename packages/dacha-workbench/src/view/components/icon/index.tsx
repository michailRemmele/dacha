import type {
  CSSProperties,
  FC,
  ComponentPropsWithoutRef,
  ReactElement,
} from 'react';

import { cx } from '../../../utils/cx';

import styles from './icon.module.css';

interface IconProps extends ComponentPropsWithoutRef<'span'> {
  icon: ReactElement;
  size?: number;
}

export const Icon: FC<IconProps> = ({
  icon,
  size = 14,
  className,
  style,
  ...rest
}) => (
  <span
    className={cx(styles.icon, className)}
    style={{ ...style, '--icon-size': `${size}px` } as CSSProperties}
    {...rest}
  >
    {icon}
  </span>
);
