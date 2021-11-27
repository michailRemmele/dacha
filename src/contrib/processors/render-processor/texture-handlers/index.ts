import { StaticTextureHandler } from './static-texture-handler';
import { SpriteTextureHandler } from './sprite-texture-handler';

export { TextureDescriptor, TextureHandler } from './texture-handler';

export const textureHandlers = {
  static: StaticTextureHandler,
  sprite: SpriteTextureHandler,
};
