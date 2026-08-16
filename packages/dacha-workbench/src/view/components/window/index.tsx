import type { ReactElement } from 'react';
import * as React from 'react';

import { WindowStyled } from './window.style';

interface WindowProps {
  children: React.ReactNode;
}

export const Window = ({ children }: WindowProps): ReactElement => (
  <WindowStyled>{children}</WindowStyled>
);
