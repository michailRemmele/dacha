import { TextureSource, Texture, Mesh as PixiMesh } from 'pixi.js';

import type { MaterialSystem } from '../../material';
import type { Assets } from '../../assets';
import type { Builder } from '../builder';
import { BLEND_MODE_MAPPING } from '../../consts';
import { Mesh } from '../../../../components/mesh';
import type { Actor } from '../../../../../engine/actor';
import { CacheStore } from '../../../../../engine/data-lib';

import { getTextureSource, getTextureArray } from './utils';
import { UNIT_QUAD_GEOMETRY } from './consts';

interface MeshBuilderOptions {
  assets: Assets;
  materialSystem: MaterialSystem;
}

export class MeshBuilder implements Builder<Mesh> {
  private assets: Assets;
  private materialSystem: MaterialSystem;

  private textureSourceMap: CacheStore<TextureSource>;
  private textureArrayMap: CacheStore<Texture[]>;

  constructor({ assets, materialSystem }: MeshBuilderOptions) {
    this.assets = assets;
    this.materialSystem = materialSystem;

    this.textureSourceMap = new CacheStore();
    this.textureArrayMap = new CacheStore();
  }

  destroy(mesh: Mesh): void {
    const textureSourceKey = mesh.renderData?.textureSourceKey;
    const textureArrayKey = mesh.renderData?.textureArrayKey;

    if (textureSourceKey) {
      this.textureSourceMap.release(textureSourceKey, true);
    }
    if (textureArrayKey) {
      this.textureArrayMap.release(textureArrayKey, true);
    }

    this.materialSystem.destroyShader(mesh);

    mesh.renderData?.view.destroy();
    mesh.renderData = undefined;
  }

  buildView(mesh: Mesh, actor: Actor): PixiMesh {
    const view = new PixiMesh({ geometry: UNIT_QUAD_GEOMETRY, pivot: 0.5 });

    mesh.renderData = { view };
    view.__dacha = {
      actor,
      builderKey: Mesh.componentName,
      viewComponent: mesh,
      meta: {},
    };

    this.updateView(mesh);

    return view;
  }

  updateView(mesh: Mesh): void {
    const view = mesh.renderData!.view;
    const meta = view.__dacha.meta;

    if (mesh.disabled !== meta.disabled) {
      view.visible = !mesh.disabled;
      meta.disabled = mesh.disabled;
    }

    if (mesh.color !== meta.color) {
      view.tint = mesh.color;
      meta.color = mesh.color;
    }

    if (mesh.blending !== meta.blending) {
      view.blendMode = BLEND_MODE_MAPPING[mesh.blending];
      meta.blending = mesh.blending;
    }

    if (mesh.opacity !== meta.opacity) {
      view.alpha = mesh.opacity;
      meta.opacity = mesh.opacity;
    }

    if (
      mesh.src !== meta.src ||
      mesh.slice !== meta.slice ||
      mesh.currentFrame !== meta.currentFrame
    ) {
      this.updateTexture(mesh);
    }

    const scaleX = mesh.flipX ? -1 : 1;
    const scaleY = mesh.flipY ? -1 : 1;
    if (
      scaleX !== meta.scaleX ||
      scaleY !== meta.scaleY ||
      mesh.width !== meta.width ||
      mesh.height !== meta.height
    ) {
      view.scale.set(mesh.width * scaleX, mesh.height * scaleY);

      meta.scaleX = scaleX;
      meta.scaleY = scaleY;
      meta.width = mesh.width;
      meta.height = mesh.height;
    }

    this.materialSystem.updateShader(mesh);
  }

  private updateTextureArray(mesh: Mesh): void {
    const oldTextureSourceKey = mesh.renderData!.textureSourceKey;
    const oldTextureArrayKey = mesh.renderData!.textureArrayKey;

    if (oldTextureSourceKey) {
      this.textureSourceMap.release(oldTextureSourceKey, true);
    }
    if (oldTextureArrayKey) {
      this.textureArrayMap.release(oldTextureArrayKey, true);
    }

    mesh.renderData!.textureSourceKey = mesh.src;
    mesh.renderData!.textureArrayKey = `${mesh.slice}_${mesh.renderData!.textureSourceKey}`;

    const textureSourceKey = mesh.renderData!.textureSourceKey!;
    const textureArrayKey = mesh.renderData!.textureArrayKey!;

    if (this.textureArrayMap.has(textureArrayKey)) {
      this.textureArrayMap.retain(textureArrayKey);
      this.textureSourceMap.retain(textureSourceKey);
      return;
    }

    if (this.textureSourceMap.has(textureSourceKey)) {
      const textureSource = this.textureSourceMap.get(textureSourceKey)!;
      const textureArray = getTextureArray(textureSource, mesh);
      this.textureArrayMap.add(textureArrayKey, textureArray);

      this.textureArrayMap.retain(textureArrayKey);
      this.textureSourceMap.retain(textureSourceKey);
    }

    const image = this.assets.get(mesh);

    if (!image) {
      return undefined;
    }

    const textureSource = getTextureSource(image);
    const textureArray = getTextureArray(textureSource, mesh);

    this.textureSourceMap.add(textureSourceKey, textureSource);
    this.textureArrayMap.add(textureArrayKey, textureArray);

    this.textureArrayMap.retain(textureArrayKey);
    this.textureSourceMap.retain(textureSourceKey);
  }

  private getTextureArray(mesh: Mesh): Texture[] | undefined {
    return this.textureArrayMap.get(mesh.renderData!.textureArrayKey!);
  }

  private updateGeometry(mesh: Mesh): void {
    const view = mesh.renderData!.view;
    const texture = view.texture;
    const geometry = view.geometry;

    const uvs = texture?.uvs;
    if (!uvs) {
      return;
    }

    const uvAttr = geometry.getAttribute('aUV');
    const uvBuffer = uvAttr.buffer.data as Float32Array;

    uvBuffer[0] = uvs.x0;
    uvBuffer[1] = uvs.y0;
    uvBuffer[2] = uvs.x1;
    uvBuffer[3] = uvs.y1;
    uvBuffer[4] = uvs.x2;
    uvBuffer[5] = uvs.y2;
    uvBuffer[6] = uvs.x3;
    uvBuffer[7] = uvs.y3;

    uvAttr.buffer.update();
  }

  private updateTexture(mesh: Mesh): void {
    const view = mesh.renderData!.view;
    const meta = view.__dacha.meta;

    if (
      this.assets.get(mesh) &&
      (mesh.src !== meta.src || mesh.slice !== meta.slice)
    ) {
      view.label = mesh.src;
      this.updateTextureArray(mesh);
      meta.src = mesh.src;
      meta.slice = mesh.slice;
    }

    const textureArray = this.getTextureArray(mesh);
    const texture = textureArray?.[mesh.currentFrame];
    view.texture = texture ?? Texture.WHITE;
    meta.currentFrame = mesh.currentFrame;

    this.updateGeometry(mesh);
  }
}
