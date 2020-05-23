import TextureHandler from './textureHandler';

class SpriteTextureHandler extends TextureHandler {
  handle(textureDescriptor, renderableComponent) {
    const { x, y, width, height } = textureDescriptor;
    const { spacing, extruding, slice } = renderableComponent;

    const padding = 2 * extruding;
    const frameWidth = ((width - ((slice - 1) * spacing)) / slice) - padding;
    const frameHeight = height - padding;

    const step = frameWidth + spacing + padding;

    return {
      x: x + (step * renderableComponent.currentFrame) + extruding,
      y: y + extruding,
      width: frameWidth,
      height: frameHeight,
    };
  }
}

export default SpriteTextureHandler;
