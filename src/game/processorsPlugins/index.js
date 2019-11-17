import AIProcessorPlugin from './aiProcessorPlugin/aiProcessorPlugin';
import DamageProcessorPlugin from './damageProcessorPlugin/damageProcessorPlugin';
import EffectsProcessorPlugin from './effectsProcessorPlugin/effectsProcessorPlugin';
import FallProcessorPlugin from './fallProcessorPlugin/fallProcessorPlugin';
import GameOverProcessorPlugin from './gameOverProcessorPlugin/gameOverProcessorPlugin';
import PlatformSizeMeterPlugin from './platformSizeMeterPlugin/platformSizeMeterPlugin';
import ShootingProcessorPlugin from './shootingProcessorPlugin/shootingProcessorPlugin';
import ReaperPlugin from './reaperPlugin/reaperPlugin';

export default {
  aiProcessor: AIProcessorPlugin,
  damageProcessor: DamageProcessorPlugin,
  effectsProcessor: EffectsProcessorPlugin,
  fallProcessor: FallProcessorPlugin,
  gameOverProcessor: GameOverProcessorPlugin,
  platformSizeMeter: PlatformSizeMeterPlugin,
  shootingProcessor: ShootingProcessorPlugin,
  reaper: ReaperPlugin,
};
