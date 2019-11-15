import InstantEffectApplicator from './instantEffectApplicator';
import DelayedEffectApplicator from './delayedEffectApplicator';
import PeriodicalEffectApplicator from './periodicalEffectApplicator';
import ContinuousEffectApplicator from './continuousEffectApplicator';
import TimeLimitedEffectApplicator from './timeLimitedEffectApplicator';

export default {
  instant: InstantEffectApplicator,
  delayed: DelayedEffectApplicator,
  periodical: PeriodicalEffectApplicator,
  continuous: ContinuousEffectApplicator,
  timeLimited: TimeLimitedEffectApplicator,
};
