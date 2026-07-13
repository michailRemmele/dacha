import {
  Shader as PixiShader,
  Color,
  type Geometry,
  type Mesh,
  Texture,
} from 'pixi.js';

import type { Time } from '../../../../engine/time';
import type { ViewComponent } from '../types';

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
          uFrameSize: { value: [0.0, 0.0], type: 'vec2<f32>' },
          uUVOffset: { value: [0.0, 0.0], type: 'vec2<f32>' },
          uUVScale: { value: [1.0, 1.0], type: 'vec2<f32>' },
          ...(config && builder?.uniforms?.(config.options)),
        },
      },
    });

    shader.__dacha = { version: this.currentVersion, meta: {} };

    return shader;
  }

  destroyShader(component: MaterialViewComponent): void {
    const view = component.renderData!.view as Mesh;

    if (view.shader) {
      view.shader.destroy();
    }
  }

  updateShader(component: MaterialViewComponent): void {
    const view = component.renderData!.view as Mesh<Geometry, PixiShader>;
    const material = component.material;

    const builder = material ? this.shaderBuilders[material.name] : undefined;

    const shaderKey =
      (material && builder?.shaderKey?.(material.name, material.options)) ??
      component.material?.name ??
      null;

    if (
      !view.shader ||
      shaderKey !== view.shader.__dacha.meta.materialShaderKey ||
      this.currentVersion !== view.shader.__dacha.version
    ) {
      this.destroyShader(component);

      view.shader = this.createShader(component.material);
      view.shader.__dacha.meta.materialShaderKey = shaderKey;
    }

    const meta = view.shader.__dacha.meta;

    if (meta.materialSampler !== view.texture.source) {
      meta.materialSampler = view.texture.source;
      view.shader.resources.uSampler = view.texture.source;
    }

    view.shader.resources.uniformsGroup.uniforms.uTime = this.time.elapsedTime;
    view.shader.resources.uniformsGroup.uniforms.uAlpha =
      view.getGlobalAlpha(true);

    const tint = view.getGlobalTint(true);
    if (meta.materialTint !== tint) {
      meta.materialTint = tint;
      view.shader.resources.uniformsGroup.uniforms.uTint = Color.shared
        .setValue(tint)
        .toRgbArray([]);
    }

    if (meta.materialTexture !== view.texture) {
      meta.materialTexture = view.texture;

      const { uvs, frame } = view.texture;

      const uniforms = view.shader.resources.uniformsGroup.uniforms;
      uniforms.uUVOffset = [uvs.x0, uvs.y0];
      uniforms.uUVScale = [uvs.x1 - uvs.x0, uvs.y2 - uvs.y0];
      uniforms.uFrameSize = [frame.width, frame.height];
    }

    if (!material || !builder) {
      return;
    }

    builder.updateUniforms?.(
      view.shader.resources.uniformsGroup.uniforms,
      material.options,
    );
  }

  reloadShaders(shaders: ShaderConstructor[]): void {
    this.shaderBuilders = createShaderBuilders(shaders);
    this.currentVersion += 1;
  }
}
