import type { Actor } from '../../../../engine/actor';
import type { EventConditionProps } from '../../../components/animatable/event-condition-props';
import type { Event } from '../../../../engine/event-target';

import { ConditionController } from './condition-controller';

export class EventConditionController implements ConditionController {
  private actor: Actor;
  private eventType: string;

  private isEventFired: boolean;

  constructor(
    props: EventConditionProps,
    actor: Actor,
  ) {
    this.actor = actor;
    this.eventType = props.eventType;
    this.isEventFired = false;

    this.actor.addEventListener(this.eventType, this.handleEvent);
  }

  destroy(): void {
    this.actor.removeEventListener(this.eventType, this.handleEvent);
  }

  private handleEvent = (event: Event): void => {
    if (event.target !== this.actor) {
      return;
    }

    this.isEventFired = true;
    this.actor.removeEventListener(this.eventType, this.handleEvent);
  };

  check(): boolean {
    return this.isEventFired;
  }
}
