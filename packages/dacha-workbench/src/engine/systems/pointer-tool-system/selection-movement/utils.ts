import { Transform } from 'dacha'
import type { TransformConfig, ActorConfig } from 'dacha'

const TOLERANCE = 0.01

export const isFloatEqual = (a: number, b: number): boolean => Math.abs(a - b) < TOLERANCE

export const updateActorTransform = (
  actorConfig: ActorConfig,
  newTransformMap: Map<string, Partial<TransformConfig>>,
): ActorConfig => {
  if (!newTransformMap.has(actorConfig.id)) {
    return {
      ...actorConfig,
      children: actorConfig.children?.map((child) => updateActorTransform(child, newTransformMap)),
    }
  }

  return {
    ...actorConfig,
    components: actorConfig.components?.map((component) => {
      if (component.name !== Transform.componentName) {
        return component
      }
      return {
        ...component,
        config: {
          ...component.config,
          ...newTransformMap.get(actorConfig.id),
        },
      }
    }),
  }
}
