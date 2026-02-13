import type { Constructor } from '../../../../types/utils';

export interface MaterialConfig {
  name: string;
  options: Record<string, unknown>;
}

type ShaderUniformType =
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

type ShaderUniformValue =
  | number
  | boolean
  | number[]
  | boolean[]
  | Float32Array
  | Int32Array
  | Uint32Array;

interface ShaderUniform {
  value: ShaderUniformValue;
  type: ShaderUniformType;
}

export type ShaderUniformDefinitions = Record<string, ShaderUniform>;
export type ShaderUniforms = Record<string, ShaderUniformValue>;

export abstract class Shader {
  static behaviorName: string;

  shaderKey?(name: string, options: unknown): string;
  abstract vertex(options: unknown): string;
  abstract fragment(options: unknown): string;
  uniforms?(options: unknown): ShaderUniformDefinitions;
  updateUniforms?(uniforms: ShaderUniforms, options: unknown): void;
}

export type ShaderConstructor = Constructor<Shader> & {
  behaviorName: string;
};
