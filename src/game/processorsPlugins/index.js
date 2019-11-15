import DamageProcessorPlugin from './damageProcessorPlugin/damageProcessorPlugin';
import EffectsProcessorPlugin from './effectsProcessorPlugin/effectsProcessorPlugin';
import FallProcessorPlugin from './fallProcessorPlugin/fallProcessorPlugin';
import GameOverProcessorPlugin from './gameOverProcessorPlugin/gameOverProcessorPlugin';
import ShootingProcessorPlugin from './shootingProcessorPlugin/shootingProcessorPlugin';
import ReaperPlugin from './reaperPlugin/reaperPlugin';

export default {
  damageProcessor: DamageProcessorPlugin,
  effectsProcessor: EffectsProcessorPlugin,
  fallProcessor: FallProcessorPlugin,
  gameOverProcessor: GameOverProcessorPlugin,
  shootingProcessor: ShootingProcessorPlugin,
  reaper: ReaperPlugin,
};
