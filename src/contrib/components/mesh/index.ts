import type { Mesh as PixiMesh } from 'pixi.js';

import { Component } from '../../../engine/component';
import { type BlendingMode } from '../../types/view';

interface RenderData {
  view: PixiMesh;
  textureSourceKey?: string;
  textureArrayKey?: string;
}

export { type BlendingMode } from '../../types/view';

export interface MaterialConfig {
  name: string;
  options: Record<string, unknown>;
}

export interface MeshConfig {
  src: string;
  width: number;
  height: number;
  slice: number;
  flipX: boolean;
  flipY: boolean;
  sortingLayer: string;
  sortCenter: [number, number];
  color: string;
  blending: BlendingMode;
  opacity: number;
  material?: MaterialConfig;
  disabled: boolean;
}

/**
 * Mesh component for rendering 2D textures with a custom shader.
 *
 * Handles the visual representation of an actor using a texture.
 * The material field specifies a shader and its options for the mesh.
 * Similar to Sprite component,
 * it can render a single texture or a frame from a sprite sheet.
 * When a material is not provided, the default shader is used.
 *
 * @example
 * ```typescript
 * // Create a mesh with a custom material shader
 * const mesh = new Mesh({
 *   src: 'assets/flame.png',
 *   width: 64,
 *   height: 64,
 *   slice: 4,
 *   flipX: false,
 *   flipY: false,
 *   sortingLayer: 'units',
 *   sortCenter: [0, 0],
 *   color: '#ffffff',
 *   blending: 'normal',
 *   opacity: 1,
 *   disabled: false,
 *   material: {
 *     name: 'HeatDistort',
 *     options: { strength: 0.2 }
 *   }
 * });
 *
 * // Add to actor
 * actor.setComponent(mesh);
 *
 * // Modify properties
 * mesh.material = undefined; // Remove the heat-distort shader and apply the default one instead
 * ```
 *
 * @category Components
 */
export class Mesh extends Component {
  /** Path to the texture image file */
  src: string;
  /** Width of the mesh in pixels */
  width: number;
  /** Height of the mesh in pixels */
  height: number;
  /** Amount of frames in the sprite sheet */
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
  sortCenter: [number, number];
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
  /** Internal rendering data */
  renderData?: RenderData;

  /**
   * Creates a new Mesh component.
   *
   * @param config - Configuration for the sprite
   */
  constructor(config: MeshConfig) {
    super();

    this.src = config.src;
    this.width = config.width;
    this.height = config.height;
    this.slice = config.slice;
    this.currentFrame = 0;
    this.flipX = config.flipX;
    this.flipY = config.flipY;
    this.disabled = config.disabled;
    this.sortingLayer = config.sortingLayer;
    this.sortCenter = config.sortCenter;
    this.color = config.color ?? '#ffffff';
    this.blending = config.blending ?? 'normal';
    this.opacity = config.opacity ?? 1;
    this.material = config.material;
  }

  clone(): Mesh {
    return new Mesh({
      src: this.src,
      width: this.width,
      height: this.height,
      slice: this.slice,
      flipX: this.flipX,
      flipY: this.flipY,
      disabled: this.disabled,
      sortingLayer: this.sortingLayer,
      sortCenter: this.sortCenter.slice(0) as [number, number],
      color: this.color,
      blending: this.blending,
      opacity: this.opacity,
      material: this.material
        ? { name: this.material.name, options: { ...this.material.options } }
        : undefined,
    });
  }
}

Mesh.componentName = 'Mesh';
