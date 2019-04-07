import TextureHandler from './textureHandler';

class StaticTextureHandler extends TextureHandler {
  handle(textureDescriptor) {
    return {
      x: textureDescriptor.x,
      y: textureDescriptor.y,
      width: textureDescriptor.width,
      height: textureDescriptor.height,
    };
  }
}

export default StaticTextureHandler;
