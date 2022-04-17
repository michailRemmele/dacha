import { Renderable } from '../../../../components/renderable';

import { SpriteTextureHandler } from '../sprite-texture-handler';

describe('Contrib -> RenderSystem -> texture handlers -> SpriteTextureHandler', () => {
  it('Return descriptor with correct params', () => {
    const textureHandler = new SpriteTextureHandler();

    const testDescriptor = {
      x: 10,
      y: 20,
      width: 150,
      height: 80,
    };
    const renderable = new Renderable('renderable', {
      src: 'some-path-to-texture',
      type: 'sprite',
      width: 30,
      height: 80,
      slice: 5,
      extruding: 5,
      spacing: 10,
      rotation: 0,
      sortCenter: [0, 0],
      flipX: false,
      flipY: false,
      disabled: false,
      sortingLayer: 'test-layer',
      fit: 'stretch',
      material: {
        type: 'basic',
      },
    });

    expect(textureHandler.handle(testDescriptor, renderable)).toEqual({
      x: 15,
      y: 25,
      width: 12,
      height: 70,
    });

    renderable.currentFrame = 1;
    expect(textureHandler.handle(testDescriptor, renderable)).toEqual({
      x: 47,
      y: 25,
      width: 12,
      height: 70,
    });

    renderable.currentFrame = 2;
    expect(textureHandler.handle(testDescriptor, renderable)).toEqual({
      x: 79,
      y: 25,
      width: 12,
      height: 70,
    });

    renderable.currentFrame = 3;
    expect(textureHandler.handle(testDescriptor, renderable)).toEqual({
      x: 111,
      y: 25,
      width: 12,
      height: 70,
    });

    renderable.currentFrame = 4;
    expect(textureHandler.handle(testDescriptor, renderable)).toEqual({
      x: 143,
      y: 25,
      width: 12,
      height: 70,
    });
  });
});
