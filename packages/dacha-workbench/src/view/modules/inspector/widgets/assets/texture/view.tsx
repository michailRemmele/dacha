import type { FC } from 'react';
import type { TextureData } from 'dacha';

import type { WidgetProps } from '../../../../../../types/widget-schema';
import { useConfig } from '../../../../../hooks';
import { Widget } from '../../../components/widget';

import { TexturePreview } from './texture-preview';

export const TextureWidget: FC<WidgetProps> = (props) => {
  const data = useConfig(props.path) as TextureData | undefined;

  return (
    <>
      <Widget {...props} />
      <TexturePreview data={data} />
    </>
  );
};
