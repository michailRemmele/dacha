import { TextureSource, Texture } from 'pixi.js';

import type { Assets } from '../../assets';
import { CacheStore } from '../../../../../engine/data-lib';
import { Sprite } from '../../../../components/sprite';
import { Mesh } from '../../../../components/mesh';

import { getTextureSource, getTextureArray } from './utils';

export class TextureArrayStore {
  private assets: Assets;

  private textureSourceMap: CacheStore<TextureSource>;
  private textureArrayMap: CacheStore<Texture[]>;

  constructor(assets: Assets) {
    this.assets = assets;

    this.textureSourceMap = new CacheStore();
    this.textureArrayMap = new CacheStore();
  }

  updateTextureArray(component: Sprite | Mesh): void {
    const oldTextureSourceKey = component.renderData!.textureSourceKey;
    const oldTextureArrayKey = component.renderData!.textureArrayKey;

    if (oldTextureSourceKey) {
      this.textureSourceMap.release(oldTextureSourceKey, true);
    }
    if (oldTextureArrayKey) {
      this.textureArrayMap.release(oldTextureArrayKey, true);
    }

    component.renderData!.textureSourceKey = component.src;
    component.renderData!.textureArrayKey = `${component.slice}_${component.renderData!.textureSourceKey}`;

    const textureSourceKey = component.renderData!.textureSourceKey!;
    const textureArrayKey = component.renderData!.textureArrayKey!;

    if (this.textureArrayMap.has(textureArrayKey)) {
      this.textureArrayMap.retain(textureArrayKey);
      this.textureSourceMap.retain(textureSourceKey);
      return;
    }

    if (this.textureSourceMap.has(textureSourceKey)) {
      const textureSource = this.textureSourceMap.get(textureSourceKey)!;
      const textureArray = getTextureArray(textureSource, component);
      this.textureArrayMap.add(textureArrayKey, textureArray);

      this.textureArrayMap.retain(textureArrayKey);
      this.textureSourceMap.retain(textureSourceKey);
    }

    const image = this.assets.get(component);

    if (!image) {
      return undefined;
    }

    const textureSource = getTextureSource(image);
    const textureArray = getTextureArray(textureSource, component);

    this.textureSourceMap.add(textureSourceKey, textureSource);
    this.textureArrayMap.add(textureArrayKey, textureArray);

    this.textureArrayMap.retain(textureArrayKey);
    this.textureSourceMap.retain(textureSourceKey);
  }

  removeTextureArray(component: Sprite | Mesh): void {
    const textureSourceKey = component.renderData?.textureSourceKey;
    const textureArrayKey = component.renderData?.textureArrayKey;

    if (textureSourceKey) {
      this.textureSourceMap.release(textureSourceKey, true);
    }
    if (textureArrayKey) {
      this.textureArrayMap.release(textureArrayKey, true);
    }
  }

  getTextureArray(component: Sprite | Mesh): Texture[] | undefined {
    return this.textureArrayMap.get(component.renderData!.textureArrayKey!);
  }
}
