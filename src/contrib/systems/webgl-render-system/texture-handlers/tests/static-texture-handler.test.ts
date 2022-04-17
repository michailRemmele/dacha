import { StaticTextureHandler } from '../static-texture-handler';

describe('Contrib -> RenderSystem -> texture handlers -> StaticTextureHandler', () => {
  it('Return descriptor with correct params', () => {
    const textureHandler = new StaticTextureHandler();

    const testDescriptor = {
      x: 10,
      y: 20,
      width: 150,
      height: 280,
    };

    expect(textureHandler.handle(testDescriptor)).toEqual(testDescriptor);
  });
});
