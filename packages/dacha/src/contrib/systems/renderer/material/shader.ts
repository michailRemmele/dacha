import type { Constructor } from '../../../../types/utils';

export interface MaterialConfig {
  name: string;
  options: Record<string, unknown>;
}

/**
 * The type of a shader uniform, as WGSL names it.
 *
 * @category Rendering
 */
export type ShaderUniformType =
  | 'f32'
  | 'i32'
  | 'vec2<f32>'
  | 'vec3<f32>'
  | 'vec4<f32>'
  | 'mat2x2<f32>'
  | 'mat3x3<f32>'
  | 'mat4x4<f32>'
  | 'mat3x2<f32>'
  | 'mat4x2<f32>'
  | 'mat2x3<f32>'
  | 'mat4x3<f32>'
  | 'mat2x4<f32>'
  | 'mat3x4<f32>'
  | 'vec2<i32>'
  | 'vec3<i32>'
  | 'vec4<i32>';

/**
 * The value of a shader uniform.
 *
 * @category Rendering
 */
export type ShaderUniformValue =
  | number
  | boolean
  | number[]
  | boolean[]
  | Float32Array
  | Int32Array
  | Uint32Array;

/**
 * A uniform of a shader: its start value and its type.
 *
 * @category Rendering
 */
export interface ShaderUniform {
  /** The start value. */
  value: ShaderUniformValue;
  /** The type of the value. */
  type: ShaderUniformType;
}

/**
 * The uniforms of a shader, by name. {@link Shader.uniforms} returns it.
 *
 * @category Rendering
 */
export type ShaderUniformDefinitions = Record<string, ShaderUniform>;
/**
 * The current values of the uniforms, by name. {@link Shader.updateUniforms}
 * writes new values into it.
 *
 * @category Rendering
 */
export type ShaderUniforms = Record<string, ShaderUniformValue>;

/**
 * Base class for the shaders of the {@link Mesh} component.
 *
 * Extend it and name the class with `@DefineShader` from
 * `dacha-workbench/decorators`. Every method gets the material options of the
 * mesh as `options`.
 *
 * @see [Shaders](https://dachajs.org/systems/rendering/shaders/)
 *
 * @category Rendering
 */
export abstract class Shader {
  /**
   * The name the configuration uses for the shader. `@DefineShader` from
   * `dacha-workbench/decorators` sets it, so a game usually does not assign it.
   */
  static behaviorName: string;

  /**
   * Runs every frame. When the returned string changes, the renderer creates
   * the shader again. Optional.
   */
  shaderKey?(name: string, options: unknown): string;
  /** Runs when the renderer creates the shader. Returns the vertex shader code. */
  abstract vertex(options: unknown): string;
  /** Runs when the renderer creates the shader. Returns the fragment shader code. */
  abstract fragment(options: unknown): string;
  /**
   * Runs when the renderer creates the shader. Returns your own uniforms, with
   * a start value and a type. Optional.
   */
  uniforms?(options: unknown): ShaderUniformDefinitions;
  /**
   * Runs every frame. Write the new uniform values into `uniforms`. Optional.
   */
  updateUniforms?(uniforms: ShaderUniforms, options: unknown): void;
}

/**
 * A shader class: a constructor with a static `behaviorName`.
 *
 * @category Rendering
 */
export type ShaderConstructor = Constructor<Shader> & {
  behaviorName: string;
};
