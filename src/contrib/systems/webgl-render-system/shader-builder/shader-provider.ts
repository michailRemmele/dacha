import type {
  EntityObserver,
  Entity,
} from '../../../../engine/entity';
import type { Renderable } from '../../../components/renderable';
import { RENDERABLE_COMPONENT_NAME } from '../consts';

export class ShaderProvider {
  private entityObserver: EntityObserver;
  private shadingIdMap: Record<string, string>;

  constructor(entityObserver: EntityObserver) {
    this.entityObserver = entityObserver;

    this.shadingIdMap = {};

    this.entityObserver.subscribe('onadd', this.handleEntityAdd);
    this.entityObserver.subscribe('onremove', this.handleEntityRemove);
  }

  getShadingId(entityId: string): string {
    return this.shadingIdMap[entityId];
  }

  private handleEntityAdd = (entity: Entity): void => {
    this.shadingIdMap[entity.getId()] = this.calculateShadingId(entity);
  };

  private handleEntityRemove = (entity: Entity): void => {
    this.shadingIdMap = Object.keys(this.shadingIdMap)
      .reduce((acc: Record<string, string>, key) => {
        if (key !== entity.getId()) {
          acc[key] = this.shadingIdMap[key];
        }

        return acc;
      }, {});
  };

  private calculateShadingId(entity: Entity): string {
    const renderable = entity.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;

    return `${renderable.fit}`;
  }
}
