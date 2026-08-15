import * as React from 'react';

import { WindowStyled } from './window.style';

interface WindowProps {
  children: React.ReactNode;
}

export const Window = ({ children }: WindowProps): JSX.Element => (
  <WindowStyled>{children}</WindowStyled>
);
