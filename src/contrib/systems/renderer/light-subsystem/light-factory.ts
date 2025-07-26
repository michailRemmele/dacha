import type { Light as ThreeJSLight } from 'three/src/Three';
import {
  AmbientLight,
  PointLight,
  Color,
} from 'three/src/Three';
import type {
  LightType,
  LightOptions,
  BaseLightOptions,
  PointLightOptions,
} from '../../../components/light';

const updateAmbientLight = (light: ThreeJSLight, options: LightOptions): void => {
  const { color, intensity } = options as BaseLightOptions;

  light.position.setZ(1);

  light.color = new Color(color);
  light.intensity = intensity;
};

const DISTANCE_FACTOR = 0.875;

const updatePointLight = (light: ThreeJSLight, options: LightOptions): void => {
  const { color, intensity, distance } = options as PointLightOptions;

  light.position.setZ(distance / 2);

  light.color = new Color(color);
  light.intensity = intensity;
  (light as PointLight).distance = distance / DISTANCE_FACTOR;
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
