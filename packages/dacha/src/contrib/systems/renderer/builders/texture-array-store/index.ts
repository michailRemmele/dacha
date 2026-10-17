import type { Texture } from 'pixi.js';

import { CacheStore } from '../../cache-store';
import type { Sprite } from '../../../../components/sprite';
import type { Mesh } from '../../../../components/mesh';

import { getTextureArray } from './utils';

export class TextureArrayStore {
  private textureArrayMap = new CacheStore<Texture[]>();

  updateTextureArray(
    component: Sprite | Mesh,
    texture: Texture | undefined,
  ): void {
    this.removeTextureArray(component);

    if (!texture) {
      return;
    }

    const key = `${component.slice}_${texture.source.uid}`;
    component.renderData!.textureArrayKey = key;

    if (!this.textureArrayMap.has(key)) {
      this.textureArrayMap.add(key, getTextureArray(texture.source, component));
    }
    this.textureArrayMap.retain(key);
  }

  removeTextureArray(component: Sprite | Mesh): void {
    const key = component.renderData?.textureArrayKey;

    if (key) {
      this.textureArrayMap.release(key);
      component.renderData!.textureArrayKey = undefined;
    }
  }

  getTextureArray(component: Sprite | Mesh): Texture[] | undefined {
    const key = component.renderData?.textureArrayKey;
    return key ? this.textureArrayMap.get(key) : undefined;
  }
}
