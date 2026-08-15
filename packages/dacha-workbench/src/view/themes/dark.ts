import { theme } from 'antd';

import type { CustomToken } from './types';

export const customToken: CustomToken = {
  canvasBackground: '#474c54',
};

export const customTheme = {
  algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
  token: {
    colorBgBase: '#202124',
  },
};
