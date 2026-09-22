import type { Mesh as PixiMesh } from 'pixi.js';

import { Component } from '../../../engine/component';
import type { Point } from '../../../engine/math-lib';
import { type BlendingMode } from '../../types/view';

interface RenderData {
  view: PixiMesh;
  textureSourceKey?: string;
  textureArrayKey?: string;
}

export { type BlendingMode } from '../../types/view';

/**
 * The shader of a {@link Mesh} with its options.
 *
 * @category Rendering
 */
export interface MaterialConfig {
  /** The `behaviorName` of the shader class. */
  name: string;
  /** The values of the shader fields. The shader methods get them as `options`. */
  options: Record<string, unknown>;
}

/**
 * Options for {@link Mesh}.
 *
 * @category Rendering
 */
export interface MeshConfig {
  src?: string;
  width?: number;
  height?: number;
  slice?: number;
  flipX?: boolean;
  flipY?: boolean;
  sortingLayer?: string;
  sortOffset?: Point;
  color?: string;
  blending?: BlendingMode;
  opacity?: number;
  material?: MaterialConfig;
  disabled?: boolean;
}

/**
 * Draws an image with your own shader. `material` sets the shader.
 *
 * @see [Shaders](https://dachajs.org/systems/rendering/shaders/)
 *
 * @category Rendering
 */
export class Mesh extends Component {
  /** Path to the texture image file */
  src: string;
  /** Width of the mesh in pixels */
  width: number;
  /** Height of the mesh in pixels */
  height: number;
  /** Number of frames in the sprite sheet */
  slice: number;
  /** Whether to flip the mesh horizontally */
  flipX: boolean;
  /** Whether to flip the mesh vertically */
  flipY: boolean;
  /** Whether the mesh is disabled and should not render */
  disabled: boolean;
  /** Sorting layer name for rendering order */
  sortingLayer: string;
  /** Center point for sorting calculations */
  sortOffset: Point;
  /** Current frame to render */
  currentFrame: number;
  /** Color tint applied to the mesh */
  color: string;
  /** Blending mode for rendering */
  blending: BlendingMode;
  /** Opacity from 0 (transparent) to 1 (opaque) */
  opacity: number;
  /** Material describes a shader and its options applied to a texture (optional). */
  material?: MaterialConfig;
  /** @internal Rendering data owned by the renderer */
  renderData?: RenderData;

  /**
   * Creates a new Mesh component.
   *
   * @param config - Configuration for the mesh
   */
  constructor(config: MeshConfig) {
    super();

    this.src = config.src ?? '';
    this.width = config.width ?? 10;
    this.height = config.height ?? 10;
    this.slice = config.slice ?? 1;
    this.currentFrame = 0;
    this.flipX = config.flipX ?? false;
    this.flipY = config.flipY ?? false;
    this.disabled = config.disabled ?? false;
    this.sortingLayer = config.sortingLayer ?? 'default';
    this.sortOffset = {
      x: config.sortOffset?.x ?? 0,
      y: config.sortOffset?.y ?? 0,
    };
    this.color = config.color ?? '#ffffff';
    this.blending = config.blending ?? 'normal';
    this.opacity = config.opacity ?? 1;
    this.material = config.material
      ? { name: config.material.name, options: { ...config.material.options } }
      : undefined;
  }
}

Mesh.componentName = 'Mesh';
