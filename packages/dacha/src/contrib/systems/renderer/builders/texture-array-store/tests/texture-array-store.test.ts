jest.mock('pixi.js', () => ({
  Rectangle: class {
    constructor(
      public x: number,
      public y: number,
      public width: number,
      public height: number,
    ) {}
  },
  Texture: class {
    source: unknown;
    frame: unknown;
    constructor({ source, frame }: { source: unknown; frame: unknown }) {
      this.source = source;
      this.frame = frame;
    }
  },
}));

import { TextureArrayStore } from '..';

const component = (slice: number): never =>
  ({ slice, renderData: {} }) as never;
const texture = (uid: number): never =>
  ({ source: { uid, width: 40, height: 10 } }) as never;

describe('TextureArrayStore', () => {
  it('slices a texture into frames', () => {
    const store = new TextureArrayStore();
    const sprite = component(4);

    store.updateTextureArray(sprite, texture(1));

    expect(store.getTextureArray(sprite)).toHaveLength(4);
  });

  it('shares frames between components with the same texture and slice', () => {
    const store = new TextureArrayStore();
    const a = component(2);
    const b = component(2);

    store.updateTextureArray(a, texture(1));
    store.updateTextureArray(b, texture(1));

    expect(store.getTextureArray(a)).toBe(store.getTextureArray(b));
  });

  it('builds new frames for a new resource of the same asset', () => {
    const store = new TextureArrayStore();
    const sprite = component(2);

    store.updateTextureArray(sprite, texture(1));
    const before = store.getTextureArray(sprite);
    store.updateTextureArray(sprite, texture(2));

    expect(store.getTextureArray(sprite)).not.toBe(before);
  });

  it('has no frames without a texture', () => {
    const store = new TextureArrayStore();
    const sprite = component(2);

    store.updateTextureArray(sprite, texture(1));
    store.updateTextureArray(sprite, undefined);

    expect(store.getTextureArray(sprite)).toBeUndefined();
  });
});
