import {
  Shader as PixiShader,
  Color,
  type Geometry,
  type Mesh,
  Texture,
} from 'pixi.js';

import type { ViewComponent, Time } from '../types';

import type { Shader, ShaderConstructor, MaterialConfig } from './shader';
import { DEFAULT_FRAGMENT_SHADER, DEFAULT_VERTEX_SHADER } from './consts';

interface MaterialSystemOptions {
  shaders?: ShaderConstructor[];
  time: Time;
}

type MaterialViewComponent = ViewComponent & {
  material?: MaterialConfig;
};

const createShaderBuilders = (
  shaders: ShaderConstructor[],
): Record<string, Shader | undefined> => {
  return shaders.reduce(
    (acc, MaterialClass) => {
      if (MaterialClass.behaviorName === undefined) {
        throw new Error(
          `Missing behaviorName field for "${MaterialClass.name}" Shader class.`,
        );
      }

      if (acc[MaterialClass.behaviorName] !== undefined) {
        console.warn(
          `Material "${MaterialClass.behaviorName}" already exists and will be overridden.`,
        );
      }

      acc[MaterialClass.behaviorName] = new MaterialClass();
      return acc;
    },
    {} as Record<string, Shader>,
  );
};

export class MaterialSystem {
  private time: Time;

  private shaderBuilders: Record<string, Shader | undefined>;

  private currentVersion: number;

  constructor({ time, shaders = [] }: MaterialSystemOptions) {
    this.time = time;

    this.shaderBuilders = createShaderBuilders(shaders);

    this.currentVersion = 0;
  }

  private createShader(config?: MaterialConfig): PixiShader {
    const builder = config ? this.shaderBuilders[config.name] : undefined;

    const shader = PixiShader.from({
      gl: {
        vertex:
          (config && builder?.vertex(config.options)) ?? DEFAULT_VERTEX_SHADER,
        fragment:
          (config && builder?.fragment(config.options)) ??
          DEFAULT_FRAGMENT_SHADER,
      },
      resources: {
        uSampler: Texture.WHITE,
        uniformsGroup: {
          uTime: { value: 0.0, type: 'f32' },
          uTint: { value: [1.0, 1.0, 1.0], type: 'vec3<f32>' },
          uAlpha: { value: 1.0, type: 'f32' },
          uTextureSize: { value: [0.0, 0.0], type: 'vec2<f32>' },
          ...(config && builder?.uniforms?.(config.options)),
        },
      },
    });

    shader.__dacha = { version: this.currentVersion };

    return shader;
  }

  destroyShader(component: MaterialViewComponent): void {
    const view = component.renderData!.view as Mesh;
    const meta = view.__dacha.meta;

    if (view.shader) {
      view.shader.destroy();
    }

    delete meta.materialShaderKey;
  }

  updateShader(component: MaterialViewComponent): void {
    const view = component.renderData!.view as Mesh<Geometry, PixiShader>;
    const material = component.material;
    const meta = view.__dacha.meta;

    const builder = material ? this.shaderBuilders[material.name] : undefined;

    const shaderKey =
      (material && builder?.shaderKey?.(material.name, material.options)) ??
      component.material?.name ??
      null;

    if (
      shaderKey !== meta.materialShaderKey ||
      (view.shader && view.shader.__dacha.version !== this.currentVersion)
    ) {
      this.destroyShader(component);

      view.shader = this.createShader(component.material);

      meta.materialShaderKey = shaderKey;
    }

    if (!view.shader) {
      return;
    }

    view.shader.resources.uSampler = view.texture.source;
    view.shader.resources.uniformsGroup.uniforms.uTime = this.time.elapsed;
    view.shader.resources.uniformsGroup.uniforms.uAlpha =
      view.getGlobalAlpha(true);

    const tint = view.getGlobalTint(true);
    if (meta.materialTint !== tint) {
      meta.materialTint = tint;
      view.shader.resources.uniformsGroup.uniforms.uTint = Color.shared
        .setValue(tint)
        .toRgbArray([]);
    }

    view.shader.resources.uniformsGroup.uniforms.uTextureSize[0] =
      view.texture.source.width;
    view.shader.resources.uniformsGroup.uniforms.uTextureSize[1] =
      view.texture.source.height;

    if (!material || !builder) {
      return;
    }

    builder.updateUniforms?.(
      material.options,
      view.shader.resources.uniformsGroup.uniforms,
    );
  }

  reloadShaders(shaders: ShaderConstructor[]): void {
    this.shaderBuilders = createShaderBuilders(shaders);
    this.currentVersion += 1;
  }
}
