import {
  TextureSource,
  Texture,
  Sprite as PixiSprite,
  TilingSprite,
  Bounds,
} from 'pixi.js';

import type { Builder } from '../builder';
import { BLEND_MODE_MAPPING } from '../../consts';
import { Transform } from '../../../../components/transform';
import { Sprite } from '../../../../components/sprite';
import type { Actor } from '../../../../../engine/actor';
import { CacheStore } from '../../../../../engine/data-lib';

import { getTextureSource, getTextureArray, floatEquals } from './utils';

interface SpriteBuilderOptions {
  imageStore: CacheStore<HTMLImageElement>;
}

export class SpriteBuilder implements Builder {
  private imageStore: CacheStore<HTMLImageElement>;

  private textureSourceMap: CacheStore<TextureSource>;
  private textureArrayMap: CacheStore<Texture[]>;

  constructor(options: SpriteBuilderOptions) {
    this.imageStore = options.imageStore;

    this.textureSourceMap = new CacheStore();
    this.textureArrayMap = new CacheStore();
  }

  destroy(actor: Actor): void {
    const sprite = actor.getComponent(Sprite);
    const textureSourceKey = sprite.renderData?.textureSourceKey;
    const textureArrayKey = sprite.renderData?.textureArrayKey;

    if (textureSourceKey) {
      this.textureSourceMap.release(textureSourceKey, true);
    }
    if (textureArrayKey) {
      this.textureArrayMap.release(textureArrayKey, true);
    }

    sprite.renderData?.view.destroy();
    sprite.renderData = undefined;
  }

  hasView(actor: Actor): boolean {
    const sprite = actor.getComponent(Sprite);
    return !!sprite.renderData?.view;
  }

  buildView(actor: Actor): PixiSprite | TilingSprite {
    const sprite = actor.getComponent(Sprite);
    const { offsetX, offsetY } = actor.getComponent(Transform);
    const options = { anchor: 0.5 };
    const view =
      sprite.fit === 'stretch'
        ? new PixiSprite(options)
        : new TilingSprite(options);

    sprite.renderData = { view };
    view.__dacha = {
      actor,
      builderKey: Sprite.componentName,
      viewComponent: sprite,
      bounds: new Bounds(offsetX, offsetY, offsetX, offsetY),
      meta: {},
      didChange: false,
    };

    return view;
  }

  updateView(actor: Actor): void {
    const transform = actor.getComponent(Transform);
    const sprite = actor.getComponent(Sprite);

    if (!sprite) {
      return undefined;
    }

    const view = sprite.renderData!.view;
    const meta = view.__dacha.meta;

    view.__dacha.didChange = false;

    if (sprite.disabled !== meta.disabled) {
      view.visible = !sprite.disabled;
      meta.disabled = sprite.disabled;
      view.__dacha.didChange = true;
    }

    if (sprite.material.options.color !== meta.color) {
      view.tint = sprite.material.options.color;
      meta.color = sprite.material.options.color;
      view.__dacha.didChange = true;
    }

    if (sprite.material.options.blending !== meta.blending) {
      view.blendMode = BLEND_MODE_MAPPING[sprite.material.options.blending];
      meta.blending = sprite.material.options.blending;
      view.__dacha.didChange = true;
    }

    if (sprite.material.options.opacity !== meta.opacity) {
      view.alpha = sprite.material.options.opacity;
      meta.opacity = sprite.material.options.opacity;
      view.__dacha.didChange = true;
    }

    const angle = transform.rotation + sprite.rotation;
    if (angle !== meta.angle) {
      view.angle = angle;
      meta.angle = angle;
      view.__dacha.didChange = true;
    }

    const { offsetX, offsetY } = transform;
    if (
      !floatEquals(offsetX, meta.offsetX as number) ||
      !floatEquals(offsetY, meta.offsetY as number)
    ) {
      view.position.set(offsetX, offsetY);
      meta.offsetX = offsetX;
      meta.offsetY = offsetY;
      view.__dacha.didChange = true;
    }

    if (
      this.imageStore.has(sprite.src) &&
      (sprite.src !== meta.src || sprite.slice !== meta.slice)
    ) {
      view.label = sprite.src;
      this.updateTextureArray(sprite);
      meta.src = sprite.src;
      meta.slice = sprite.slice;
      view.__dacha.didChange = true;
    }

    const textureArray = this.getTextureArray(sprite);
    const texture = textureArray?.[sprite.currentFrame ?? 0];
    view.texture = texture ?? Texture.WHITE;

    const scaleX = (sprite.flipX ? -1 : 1) * transform.scaleX;
    const scaleY = (sprite.flipY ? -1 : 1) * transform.scaleY;
    if (
      view.texture !== meta.texture ||
      scaleX !== meta.scaleX ||
      scaleY !== meta.scaleY ||
      sprite.width !== meta.width ||
      sprite.height !== meta.height
    ) {
      if (sprite.fit === 'stretch') {
        view.scale.set(
          (sprite.width / view.texture.width) * scaleX,
          (sprite.height / view.texture.height) * scaleY,
        );
      }
      if (sprite.fit === 'repeat') {
        view.setSize(sprite.width, sprite.height);
        view.scale.set(scaleX, scaleY);
      }

      meta.texture = view.texture;
      meta.scaleX = scaleX;
      meta.scaleY = scaleY;
      meta.width = sprite.width;
      meta.height = sprite.height;
      view.__dacha.didChange = true;
    }
  }

  private updateTextureArray(sprite: Sprite): void {
    const oldTextureSourceKey = sprite.renderData!.textureSourceKey;
    const oldTextureArrayKey = sprite.renderData!.textureArrayKey;

    if (oldTextureSourceKey) {
      this.textureSourceMap.release(oldTextureSourceKey, true);
    }
    if (oldTextureArrayKey) {
      this.textureArrayMap.release(oldTextureArrayKey, true);
    }

    sprite.renderData!.textureSourceKey = sprite.src;
    sprite.renderData!.textureArrayKey = `${sprite.slice}_${sprite.renderData!.textureSourceKey}`;

    const textureSourceKey = sprite.renderData!.textureSourceKey!;
    const textureArrayKey = sprite.renderData!.textureArrayKey!;

    if (this.textureArrayMap.has(textureArrayKey)) {
      this.textureArrayMap.retain(textureArrayKey);
      this.textureSourceMap.retain(textureSourceKey);
      return;
    }

    if (this.textureSourceMap.has(textureSourceKey)) {
      const textureSource = this.textureSourceMap.get(textureSourceKey)!;
      const textureArray = getTextureArray(textureSource, sprite);
      this.textureArrayMap.add(textureArrayKey, textureArray);

      this.textureArrayMap.retain(textureArrayKey);
      this.textureSourceMap.retain(textureSourceKey);
    }

    const image = this.imageStore.get(sprite.src);

    if (!image) {
      return undefined;
    }

    const textureSource = getTextureSource(image);
    const textureArray = getTextureArray(textureSource, sprite);

    this.textureSourceMap.add(textureSourceKey, textureSource);
    this.textureArrayMap.add(textureArrayKey, textureArray);

    this.textureArrayMap.retain(textureArrayKey);
    this.textureSourceMap.retain(textureSourceKey);
  }

  private getTextureArray(sprite: Sprite): Texture[] | undefined {
    return this.textureArrayMap.get(sprite.renderData!.textureArrayKey!);
  }
}
