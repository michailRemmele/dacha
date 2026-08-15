import type { FC, ComponentPropsWithoutRef, ReactElement } from 'react';

import { IconStyled } from './icon.style';

interface IconProps extends ComponentPropsWithoutRef<'span'> {
  icon: ReactElement;
  size?: number;
}

export const Icon: FC<IconProps> = ({ icon, size = 14, ...rest }) => (
  <IconStyled size={size} {...rest}>
    {icon}
  </IconStyled>
);
