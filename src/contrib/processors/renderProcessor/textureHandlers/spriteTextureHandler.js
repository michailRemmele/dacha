import TextureHandler from './textureHandler';

class SpriteTextureHandler extends TextureHandler {
  handle(textureDescriptor, renderableComponent) {
    const width = textureDescriptor.width / renderableComponent.slice;
    const height = textureDescriptor.height;

    return {
      x: textureDescriptor.x + (width * renderableComponent.currentFrame),
      y: textureDescriptor.y,
      width: width,
      height: height,
    };
  }
}

export default SpriteTextureHandler;
