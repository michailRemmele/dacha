import {
  TextureSource,
  Texture,
  Sprite as PixiSprite,
  TilingSprite,
} from 'pixi.js';

import type { Assets } from '../../assets';
import type { Builder } from '../builder';
import { BLEND_MODE_MAPPING } from '../../consts';
import { Sprite } from '../../../../components/sprite';
import type { Actor } from '../../../../../engine/actor';
import { CacheStore } from '../../../../../engine/data-lib';

import { getTextureSource, getTextureArray } from './utils';

interface SpriteBuilderOptions {
  assets: Assets;
}

export class SpriteBuilder implements Builder<Sprite> {
  private assets: Assets;

  private textureSourceMap: CacheStore<TextureSource>;
  private textureArrayMap: CacheStore<Texture[]>;

  constructor({ assets }: SpriteBuilderOptions) {
    this.assets = assets;

    this.textureSourceMap = new CacheStore();
    this.textureArrayMap = new CacheStore();
  }

  destroy(sprite: Sprite): void {
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

  buildView(sprite: Sprite, actor: Actor): PixiSprite | TilingSprite {
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
      meta: {},
    };

    return view;
  }

  updateView(sprite: Sprite): void {
    const view = sprite.renderData!.view;
    const meta = view.__dacha.meta;

    if (sprite.disabled !== meta.disabled) {
      view.visible = !sprite.disabled;
      meta.disabled = sprite.disabled;
    }

    if (sprite.color !== meta.color) {
      view.tint = sprite.color;
      meta.color = sprite.color;
    }

    if (sprite.blending !== meta.blending) {
      view.blendMode = BLEND_MODE_MAPPING[sprite.blending];
      meta.blending = sprite.blending;
    }

    if (sprite.opacity !== meta.opacity) {
      view.alpha = sprite.opacity;
      meta.opacity = sprite.opacity;
    }

    if (
      this.assets.get(sprite) &&
      (sprite.src !== meta.src || sprite.slice !== meta.slice)
    ) {
      view.label = sprite.src;
      this.updateTextureArray(sprite);
      meta.src = sprite.src;
      meta.slice = sprite.slice;
    }

    const textureArray = this.getTextureArray(sprite);
    const texture = textureArray?.[sprite.currentFrame ?? 0];
    view.texture = texture ?? Texture.WHITE;

    const scaleX = sprite.flipX ? -1 : 1;
    const scaleY = sprite.flipY ? -1 : 1;
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

    const image = this.assets.get(sprite);

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
