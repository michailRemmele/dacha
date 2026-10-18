import type { FC } from 'react';
import type { BitmapFontData } from 'dacha';

import type { WidgetProps } from '../../../../../../types/widget-schema';
import { useConfig } from '../../../../../hooks';
import { Widget } from '../../../components/widget';

import { BitmapFontPreview } from './bitmap-font-preview';

export const BitmapFontWidget: FC<WidgetProps> = (props) => {
  const data = useConfig(props.path) as BitmapFontData | undefined;

  return (
    <>
      <Widget {...props} />
      <BitmapFontPreview src={data?.src} />
    </>
  );
};
