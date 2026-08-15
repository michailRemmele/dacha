import { Texture, Audio, BitmapFont } from 'dacha';
import type { WidgetSchema } from '../../../../../types/widget-schema';

export const assetsSchema: Record<string, WidgetSchema> = {
  [Texture.assetName]: {
    fields: [
      { name: 'src', type: 'file', extensions: ['png', 'jpg', 'jpeg', 'webp'] },
    ],
  },
  [Audio.assetName]: {
    fields: [{ name: 'src', type: 'file', extensions: ['mp3', 'wav', 'ogg'] }],
  },
  [BitmapFont.assetName]: {
    fields: [{ name: 'src', type: 'file', extensions: ['fnt', 'xml'] }],
  },
};
