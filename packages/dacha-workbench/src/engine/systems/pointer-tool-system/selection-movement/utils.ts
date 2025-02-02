import { Transform } from 'dacha'
import type {
  Sprite,
  TransformConfig,
  ActorConfig,
} from 'dacha'

const TOLERANCE = 0.01

export const isFloatEqual = (a: number, b: number): boolean => Math.abs(a - b) < TOLERANCE

export const getSizeX = (transform: Transform, sprite?: Sprite): number => {
  const scaleX = transform.scaleX || 1
  const width = sprite?.width || 0

  return scaleX * width
}
export const getSizeY = (transform: Transform, sprite?: Sprite): number => {
  const scaleY = transform.scaleY || 1
  const height = sprite?.height || 0

  return scaleY * height
}

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
