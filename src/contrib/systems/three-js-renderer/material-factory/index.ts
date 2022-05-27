import type {
  Material,
  Texture,
  Blending,
} from 'three';
import {
  MeshBasicMaterial,
  MeshStandardMaterial,
  Color,
  NormalBlending,
  AdditiveBlending,
  SubtractiveBlending,
  MultiplyBlending,
  DataTexture,
} from 'three';
import type {
  MaterialType,
  BasicMaterialOptions,
  BlendingMode,
} from '../../../components/renderable';

const DEFAULT_COLOR = '#ffffff';
const DEFAULT_BLENDING = 'normal';
const DEFAULT_OPACITY = 1;
const DEFAULT_TEXTURE = new DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1);

const blendingMap: Record<BlendingMode, Blending> = {
  normal: NormalBlending,
  addition: AdditiveBlending,
  substract: SubtractiveBlending,
  multiply: MultiplyBlending,
};

const updateBasicMaterial = (
  material: Material,
  componentOptions: BasicMaterialOptions,
  texture: Texture = DEFAULT_TEXTURE,
): void => {
  const {
    color = DEFAULT_COLOR,
    blending = DEFAULT_BLENDING,
    opacity = DEFAULT_OPACITY,
  } = componentOptions;
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

const materialMap: Record<MaterialType, typeof Material> = {
  lightsensitive: MeshStandardMaterial,
  basic: MeshBasicMaterial,
};

export const createMaterial = (type: MaterialType): Material => new materialMap[type]();

export const updateMaterial = (
  type: MaterialType,
  material: Material,
  options: BasicMaterialOptions,
  texture?: Texture,
): void => {
  updateBasicMaterial(material, options, texture);
};
