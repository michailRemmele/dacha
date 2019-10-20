import DamageProcessorPlugin from './damageProcessorPlugin/damageProcessorPlugin';
import EffectsProcessorPlugin from './effectsProcessorPlugin/effectsProcessorPlugin';
import FallProcessorPlugin from './fallProcessorPlugin/fallProcessorPlugin';
import ShootingProcessorPlugin from './shootingProcessorPlugin/shootingProcessorPlugin';
import ReaperPlugin from './reaperPlugin/reaperPlugin';

export default {
  damageProcessor: DamageProcessorPlugin,
  effectsProcessor: EffectsProcessorPlugin,
  fallProcessor: FallProcessorPlugin,
  shootingProcessor: ShootingProcessorPlugin,
  reaper: ReaperPlugin,
};
