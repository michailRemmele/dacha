import { Component } from '../../../engine/component';

import { Material, MaterialConfig } from './material';

type RenderableType = 'sprite' | 'static';
type FitType = 'stretch' | 'repeat';

export type { MaterialType, BasicMaterialOptions, BlendingMode } from './material';

export interface RenderableConfig {
  src: string
  width: number
  height: number
  type: RenderableType
  slice?: number
  spacing: number // deprecated
  extruding: number // deprecated
  rotation: number
  flipX: boolean
  flipY: boolean
  disabled: boolean
  sortingLayer: string
  sortCenter: [number, number]
  fit: FitType
  material: MaterialConfig
}

export class Renderable extends Component {
  private _slice?: number;

  src: string;
  width: number;
  height: number;
  type: RenderableType;
  spacing: number;
  extruding: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  disabled: boolean;
  sortingLayer: string;
  sortCenter: [number, number];
  currentFrame?: number;
  fit: FitType;
  material: Material;

  constructor(config: RenderableConfig) {
    super();

    this.src = config.src;
    this.width = config.width;
    this.height = config.height;
    this.type = config.type;
    this._slice = config.slice;
    this.spacing = config.spacing || 0;
    this.extruding = config.extruding || 0;
    this.currentFrame = config.type === 'sprite' ? 0 : void 0;
    this.rotation = config.rotation;
    this.flipX = config.flipX;
    this.flipY = config.flipY;
    this.disabled = config.disabled;
    this.sortingLayer = config.sortingLayer;
    this.sortCenter = config.sortCenter;
    this.fit = config.fit;
    this.material = new Material(config.material);
  }

  get slice(): number {
    return this.type === 'sprite' ? (this._slice || 0) : 1;
  }

  set slice(value: number) {
    this._slice = value;
  }

  clone(): Renderable {
    return new Renderable({
      src: this.src,
      width: this.width,
      height: this.height,
      type: this.type,
      slice: this.slice,
      spacing: this.spacing,
      extruding: this.extruding,
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

Renderable.componentName = 'Renderable';
