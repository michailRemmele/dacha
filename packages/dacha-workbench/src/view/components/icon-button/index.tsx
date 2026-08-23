import type { FC } from 'react';
import { Button } from 'antd';
import type { ButtonProps } from 'antd';

export type IconButtonProps = ButtonProps;

export const IconButton: FC<IconButtonProps> = ({
  type = 'text',
  ...rest
}) => <Button type={type} {...rest} />;
