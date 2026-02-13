import { Texture, Mesh as PixiMesh, MeshGeometry } from 'pixi.js';

import type { MaterialSystem } from '../../material';
import type { Assets } from '../../assets';
import type { Builder } from '../builder';
import { BLEND_MODE_MAPPING } from '../../consts';
import { Mesh } from '../../../../components/mesh';
import type { Actor } from '../../../../../engine/actor';
import { TextureArrayStore } from '../texture-array-store';
import { GEOMETRY_POSITIONS, GEOMETRY_INDICES } from './consts';

interface MeshBuilderOptions {
  assets: Assets;
  materialSystem: MaterialSystem;
}

export class MeshBuilder implements Builder<Mesh> {
  private assets: Assets;
  private materialSystem: MaterialSystem;

  private textureArrayStore: TextureArrayStore;

  constructor({ assets, materialSystem }: MeshBuilderOptions) {
    this.assets = assets;
    this.materialSystem = materialSystem;

    this.textureArrayStore = new TextureArrayStore(assets);
  }

  destroy(mesh: Mesh): void {
    this.textureArrayStore.removeTextureArray(mesh);

    this.materialSystem.destroyShader(mesh);

    mesh.renderData?.view.destroy();
    mesh.renderData = undefined;
  }

  buildView(mesh: Mesh, actor: Actor): PixiMesh {
    const view = new PixiMesh({
      geometry: new MeshGeometry({
        positions: GEOMETRY_POSITIONS,
        uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
        indices: GEOMETRY_INDICES,
      }),
      pivot: 0.5,
    });

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
      this.textureArrayStore.updateTextureArray(mesh);
      meta.src = mesh.src;
      meta.slice = mesh.slice;
    }

    const textureArray = this.textureArrayStore.getTextureArray(mesh);
    const texture = textureArray?.[mesh.currentFrame];
    view.texture = texture ?? Texture.WHITE;
    meta.currentFrame = mesh.currentFrame;

    this.updateGeometry(mesh);
  }
}
