import type { FC } from 'react';
import type { AudioData } from 'dacha';

import type { WidgetProps } from '../../../../../../types/widget-schema';
import { useConfig } from '../../../../../hooks';
import { Widget } from '../../../components/widget';

import { AudioPlayer } from './audio-player';

export const AudioWidget: FC<WidgetProps> = (props) => {
  const data = useConfig(props.path) as AudioData | undefined;

  return (
    <>
      <Widget {...props} />
      <AudioPlayer src={data?.src} />
    </>
  );
};
