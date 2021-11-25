import { TextureHandler, TextureDescriptor } from './texture-handler';

export class StaticTextureHandler implements TextureHandler {
  handle(textureDescriptor: TextureDescriptor) {
    return {
      x: textureDescriptor.x,
      y: textureDescriptor.y,
      width: textureDescriptor.width,
      height: textureDescriptor.height,
    };
  }
}
