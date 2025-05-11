import type { Actor } from 'dacha'

export interface SelectedActors {
  actorPaths: string[][]
  frames: Actor[]
  sceneId?: string
}

export interface SelectionArea {
  area: Actor
  size: {
    x0: number
    y0: number
    x1: number
    y1: number
  }
  sceneSize: {
    x0: number
    y0: number
    x1: number
    y1: number
  }
}
