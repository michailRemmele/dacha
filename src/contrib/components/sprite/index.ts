import type { Sprite as PixiSprite, TilingSprite } from 'pixi.js';

import { Component } from '../../../engine/component';

import { Material, MaterialConfig } from './material';

interface RenderData {
  view: PixiSprite | TilingSprite;
  textureSourceKey?: string;
  textureArrayKey?: string;
}

type FitType = 'stretch' | 'repeat';

export type {
  MaterialType,
  BasicMaterialOptions,
  BlendingMode,
} from './material';

export interface SpriteConfig {
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
  fit: FitType;
  material: MaterialConfig;
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
  readonly fit: FitType;
  material: Material;
  renderData?: RenderData;

  constructor(config: SpriteConfig) {
    super();

    this.src = config.src;
    this.width = config.width;
    this.height = config.height;
    this.slice = config.slice;
    this.currentFrame = 0;
    this.rotation = config.rotation;
    this.flipX = config.flipX;
    this.flipY = config.flipY;
    this.disabled = config.disabled;
    this.sortingLayer = config.sortingLayer;
    this.sortCenter = config.sortCenter;
    this.fit = config.fit;
    this.material = new Material(config.material);
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
