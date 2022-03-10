import type {
  Material,
  Texture,
} from 'three';
import {
  MeshBasicMaterial,
  MeshStandardMaterial,
  Color,
} from 'three';
import type {
  MaterialType,
  BasicMaterialOptions,
} from '../../../components/renderable';

const DEFAULT_COLOR = '#ffffff';

const updateBasicMaterial = (
  material: Material,
  componentOptions: BasicMaterialOptions,
  texture: Texture,
): void => {
  const { color = DEFAULT_COLOR } = componentOptions;
  const basicMaterial = material as MeshBasicMaterial;

  basicMaterial.transparent = true;
  basicMaterial.map = texture;

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
  texture: Texture,
): void => {
  updateBasicMaterial(material, options, texture);
};
