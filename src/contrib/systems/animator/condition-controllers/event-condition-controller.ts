import type { GameObject } from '../../../../engine/game-object';
import type { EventConditionProps } from '../../../components/animatable/event-condition-props';

import { ConditionController } from './condition-controller';

export class EventConditionController implements ConditionController {
  private isEventFired: boolean;

  constructor(
    props: EventConditionProps,
    gameObject: GameObject,
  ) {
    this.isEventFired = false;

    const { eventType } = props;

    const handleEvent = (): void => {
      this.isEventFired = true;
      gameObject.removeEventListener(eventType, handleEvent);
    };

    gameObject.addEventListener(eventType, handleEvent);
  }

  check(): boolean {
    return this.isEventFired;
  }
}
