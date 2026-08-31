import { FC, ReactElement, SVGProps } from 'react';
import * as Icons from '@gravity-ui/icons';

import type { IconName } from '../../../../../types/widget-schema';

const iconMap: Record<IconName, FC<SVGProps<SVGSVGElement>>> = Icons;

const isKey = (name: string): name is IconName => name in iconMap;

export const resolveIcon = (name: string): ReactElement | undefined => {
  const IconComponent = isKey(name) ? iconMap[name] : undefined;

  if (!IconComponent) {
    return undefined;
  }

  return <IconComponent />;
};
