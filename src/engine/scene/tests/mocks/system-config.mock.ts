import type { SystemConfig } from '../../../types';

export const getSystemConfigMock = (name: string): SystemConfig => ({
  name,
  options: {},
});
