import type { Actor } from '../../../../engine/actor';
import type { EventConditionProps } from '../../../components/animatable/event-condition-props';
import type { Event } from '../../../../engine/event-target';

import { ConditionController } from './condition-controller';

export class EventConditionController implements ConditionController {
  private isEventFired: boolean;

  constructor(
    props: EventConditionProps,
    actor: Actor,
  ) {
    this.isEventFired = false;

    const { eventType } = props;

    const handleEvent = (event: Event): void => {
      if (event.target !== actor) {
        return;
      }

      this.isEventFired = true;
      actor.removeEventListener(eventType, handleEvent);
    };

    actor.addEventListener(eventType, handleEvent);
  }

  check(): boolean {
    return this.isEventFired;
  }
}
