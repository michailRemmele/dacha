import { Texture, Mesh as PixiMesh, MeshGeometry } from 'pixi.js';

import type { MaterialSystem } from '../../material';
import type { Assets } from '../../../../../engine/asset';
import { Texture as TextureAsset } from '../../../../assets';
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

    this.textureArrayStore = new TextureArrayStore();
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

    const textureAsset = this.assets.get(TextureAsset, mesh.texture);
    if (textureAsset && !textureAsset.resource) {
      void textureAsset.load();
    }
    const resource = textureAsset?.resource;
    if (resource !== meta.resource || mesh.slice !== meta.slice) {
      view.label = mesh.texture;
      this.textureArrayStore.updateTextureArray(mesh, resource);
      meta.resource = resource;
      meta.slice = mesh.slice;
    }

    const textureArray = this.textureArrayStore.getTextureArray(mesh);
    const texture = textureArray?.[mesh.currentFrame];
    view.texture = texture ?? Texture.WHITE;

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
}
