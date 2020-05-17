import TextureHandler from './textureHandler';

class SpriteTextureHandler extends TextureHandler {
  handle(textureDescriptor, renderableComponent) {
    const width = renderableComponent.width;
    const height = renderableComponent.height;
    const step = width + renderableComponent.spacing;

    return {
      x: textureDescriptor.x + (step * renderableComponent.currentFrame),
      y: textureDescriptor.y,
      width: width,
      height: height,
    };
  }
}

export default SpriteTextureHandler;
