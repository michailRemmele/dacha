import type { FC } from 'react';
import { Button } from 'antd';
import type { ButtonProps } from 'antd';

import { cx } from '../../../utils/cx';

import * as styles from './icon-button.module.css';

export type IconButtonProps = ButtonProps;

export const IconButton: FC<IconButtonProps> = ({
  type = 'text',
  className,
  ...rest
}) => (
  <Button type={type} className={cx(styles.iconButton, className)} {...rest} />
);
