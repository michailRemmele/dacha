import { Component } from '../../../engine/component';

import { Material, MaterialConfig } from './material';

type FitType = 'stretch' | 'repeat';

export type { MaterialType, BasicMaterialOptions, BlendingMode } from './material';

export interface SpriteConfig extends Record<string, unknown> {
  src: string
  width: number
  height: number
  slice: number
  rotation: number
  flipX: boolean
  flipY: boolean
  disabled: boolean
  sortingLayer: string
  sortCenter: [number, number]
  fit: FitType
  material: MaterialConfig
}

export class Sprite extends Component {
  src: string;
  width: number;
  height: number;
  slice: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  disabled: boolean;
  sortingLayer: string;
  sortCenter: [number, number];
  currentFrame?: number;
  fit: FitType;
  material: Material;

  constructor(config: Record<string, unknown>) {
    super();

    const spriteConfig = config as SpriteConfig;

    this.src = spriteConfig.src;
    this.width = spriteConfig.width;
    this.height = spriteConfig.height;
    this.slice = spriteConfig.slice;
    this.currentFrame = 0;
    this.rotation = spriteConfig.rotation;
    this.flipX = spriteConfig.flipX;
    this.flipY = spriteConfig.flipY;
    this.disabled = spriteConfig.disabled;
    this.sortingLayer = spriteConfig.sortingLayer;
    this.sortCenter = spriteConfig.sortCenter;
    this.fit = spriteConfig.fit;
    this.material = new Material(spriteConfig.material);
  }

  clone(): Sprite {
    return new Sprite({
      src: this.src,
      width: this.width,
      height: this.height,
      slice: this.slice,
      rotation: this.rotation,
      flipX: this.flipX,
      flipY: this.flipY,
      disabled: this.disabled,
      sortingLayer: this.sortingLayer,
      sortCenter: this.sortCenter.slice(0) as [number, number],
      fit: this.fit,
      material: this.material,
    });
  }
}

Sprite.componentName = 'Sprite';
