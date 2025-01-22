import type { SceneEvent } from 'dacha'
import type { MouseControlEvent } from 'dacha/events'

import type { SettingsConfig } from '../engine/components/settings'

import * as EventType from './event-types'

export * as EventType from './event-types'

export type SelectToolEvent = SceneEvent<{
  name: string
}>

export type SetToolFeatureValueEvent = SceneEvent<{
  name: string
  value: string | boolean | number
}>

export type SetSettingsValueEvent = SceneEvent<{
  name: keyof SettingsConfig
  value: string | boolean | number
}>

export type SelectLevelEvent = SceneEvent<{
  levelId: string | undefined
}>

export type InspectEntityEvent = SceneEvent<{
  path: Array<string> | undefined
}>

declare module 'dacha' {
  export interface SceneEventMap {
    [EventType.SelectTool]: SelectToolEvent
    [EventType.SetToolFeatureValue]: SetToolFeatureValueEvent
    [EventType.SetSettingsValue]: SetSettingsValueEvent
    [EventType.SelectLevel]: SelectLevelEvent
    [EventType.InspectEntity]: InspectEntityEvent
    [EventType.InspectedEntityChange]: InspectEntityEvent
    [EventType.SaveProject]: SceneEvent
  }

  export interface ActorEventMap {
    [EventType.ToolCursorMove]: MouseControlEvent
    [EventType.ToolCursorLeave]: MouseControlEvent
    [EventType.CameraZoom]: MouseControlEvent
    [EventType.CameraMoveStart]: MouseControlEvent
    [EventType.CameraMoveEnd]: MouseControlEvent
    [EventType.CameraMove]: MouseControlEvent
    [EventType.SelectionMoveStart]: MouseControlEvent
    [EventType.SelectionMoveEnd]: MouseControlEvent
    [EventType.SelectionMove]: MouseControlEvent
    [EventType.AddFromTemplate]: MouseControlEvent
  }
}
