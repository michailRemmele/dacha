import { Renderable } from '../../../components/renderable';

import { TextureHandler, TextureDescriptor } from './texture-handler';

export class SpriteTextureHandler implements TextureHandler {
  handle(textureDescriptor: TextureDescriptor, renderable: Renderable) {
    const {
      x, y, width, height,
    } = textureDescriptor;
    const {
      spacing,
      extruding,
      slice = 0,
      currentFrame = 0,
    } = renderable;

    const padding = 2 * extruding;
    const frameWidth = ((width - ((slice - 1) * spacing)) / slice) - padding;
    const frameHeight = height - padding;

    const step = frameWidth + spacing + padding;

    return {
      x: x + (step * currentFrame) + extruding,
      y: y + extruding,
      width: frameWidth,
      height: frameHeight,
    };
  }
}
