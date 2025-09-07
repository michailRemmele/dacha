import type { Material, Texture, Blending } from 'three/src/Three';
import {
  MeshBasicMaterial,
  Color,
  NormalBlending,
  AdditiveBlending,
  SubtractiveBlending,
  MultiplyBlending,
  DataTexture,
} from 'three/src/Three';
import type { Sprite, BlendingMode } from '../../../components/sprite';

const DEFAULT_COLOR = '#ffffff';
const DEFAULT_BLENDING = 'normal';
const DEFAULT_OPACITY = 1;

const DEFAULT_TEXTURE = new DataTexture(
  new Uint8Array([255, 255, 255, 255]),
  1,
  1,
);
DEFAULT_TEXTURE.needsUpdate = true;

const blendingMap: Record<BlendingMode, Blending> = {
  normal: NormalBlending,
  addition: AdditiveBlending,
  substract: SubtractiveBlending,
  multiply: MultiplyBlending,
};

const updateBasicMaterial = (
  sprite: Sprite,
  material: Material,
  texture: Texture = DEFAULT_TEXTURE,
): void => {
  const {
    color = DEFAULT_COLOR,
    blending = DEFAULT_BLENDING,
    opacity = DEFAULT_OPACITY,
  } = sprite;
  const basicMaterial = material as MeshBasicMaterial;

  basicMaterial.transparent = true;
  basicMaterial.map = texture;
  basicMaterial.blending = blendingMap[blending];
  basicMaterial.opacity = opacity;

  const currentColor = `#${basicMaterial.color.getHexString()}`;

  if (color !== currentColor) {
    basicMaterial.color = new Color(color);
  }
};

export const createMaterial = (): Material => new MeshBasicMaterial();

export const updateMaterial = (
  sprite: Sprite,
  material: Material,
  texture?: Texture,
): void => {
  updateBasicMaterial(sprite, material, texture);
};
