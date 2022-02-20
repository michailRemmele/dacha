import type { Light as ThreeJSLight } from 'three';
import {
  AmbientLight,
  PointLight,
  Color,
} from 'three';
import type {
  LightType,
  LightOptions,
  BaseLightOptions,
  PointLightOptions,
} from '../../../components/light';

const updateAmbientLight = (light: ThreeJSLight, options: LightOptions): void => {
  const { color, intensity } = options as BaseLightOptions;

  light.color = new Color(color);
  light.intensity = intensity;
};

const updatePointLight = (light: ThreeJSLight, options: LightOptions): void => {
  const { color, intensity, distance } = options as PointLightOptions;

  light.color = new Color(color);
  light.intensity = intensity;
  (light as PointLight).distance = distance;
};

type UpdateLightFn = (light: ThreeJSLight, options: LightOptions) => void;
const lightUpdateStrategyMap: Record<LightType, UpdateLightFn> = {
  ambient: updateAmbientLight,
  point: updatePointLight,
};

const lightMap: Record<LightType, typeof ThreeJSLight> = {
  ambient: AmbientLight,
  point: PointLight,
};

export const createLight = (type: LightType): ThreeJSLight => new lightMap[type]();

export const updateLight = (
  type: LightType,
  light: ThreeJSLight,
  options: LightOptions,
): void => {
  lightUpdateStrategyMap[type](light, options);
};
