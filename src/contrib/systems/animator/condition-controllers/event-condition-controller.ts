import type { GameObject } from '../../../../engine/game-object';
import type { EventConditionProps } from '../../../components/animatable/event-condition-props';
import type { Event } from '../../../../engine/event-target';

import { ConditionController } from './condition-controller';

export class EventConditionController implements ConditionController {
  private isEventFired: boolean;

  constructor(
    props: EventConditionProps,
    gameObject: GameObject,
  ) {
    this.isEventFired = false;

    const { eventType } = props;

    const handleEvent = (event: Event): void => {
      if (event.target !== gameObject) {
        return;
      }

      this.isEventFired = true;
      gameObject.removeEventListener(eventType, handleEvent);
    };

    gameObject.addEventListener(eventType, handleEvent);
  }

  check(): boolean {
    return this.isEventFired;
  }
}
