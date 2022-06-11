import { Component } from '../../../engine/component';

import { Material, MaterialConfig } from './material';

type RenderableType = 'sprite' | 'static';
type FitType = 'stretch' | 'repeat';

export type { MaterialType, BasicMaterialOptions, BlendingMode } from './material';

export interface RenderableConfig extends Record<string, unknown> {
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
  src: string;
  width: number;
  height: number;
  type: RenderableType;
  slice?: number;
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

  constructor(componentName: string, config: Record<string, unknown>) {
    super(componentName);

    const renderableConfig = config as RenderableConfig;

    this.src = renderableConfig.src;
    this.width = renderableConfig.width;
    this.height = renderableConfig.height;
    this.type = renderableConfig.type;
    this.slice = renderableConfig.slice;
    this.spacing = renderableConfig.spacing || 0;
    this.extruding = renderableConfig.extruding || 0;
    this.currentFrame = renderableConfig.type === 'sprite' ? 0 : void 0;
    this.rotation = renderableConfig.rotation;
    this.flipX = renderableConfig.flipX;
    this.flipY = renderableConfig.flipY;
    this.disabled = renderableConfig.disabled;
    this.sortingLayer = renderableConfig.sortingLayer;
    this.sortCenter = renderableConfig.sortCenter;
    this.fit = renderableConfig.fit;
    this.material = new Material(renderableConfig.material);
  }

  clone(): Renderable {
    return new Renderable(this.componentName, {
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
