import type { WorldEvent } from 'dacha'
import type { MouseControlEvent } from 'dacha/events'

import type { SettingsConfig } from '../engine/components/settings'

import * as EventType from './event-types'

export * as EventType from './event-types'

export type SelectToolEvent = WorldEvent<{
  name: string
}>

export type SetToolFeatureValueEvent = WorldEvent<{
  name: string
  value: string | boolean | number
}>

export type SetSettingsValueEvent = WorldEvent<{
  name: keyof SettingsConfig
  value: string | boolean | number
}>

export type SelectSceneEvent = WorldEvent<{
  sceneId: string | undefined
}>

export type InspectEntityEvent = WorldEvent<{
  path: Array<string> | undefined
}>

export type SelectEntitiesEvent = WorldEvent<{
  paths: string[][]
}>

declare module 'dacha' {
  export interface WorldEventMap {
    [EventType.SelectTool]: SelectToolEvent
    [EventType.SetToolFeatureValue]: SetToolFeatureValueEvent
    [EventType.ToolUpdated]: WorldEvent
    [EventType.SetSettingsValue]: SetSettingsValueEvent
    [EventType.SelectScene]: SelectSceneEvent
    [EventType.InspectEntity]: InspectEntityEvent
    [EventType.InspectedEntityChange]: InspectEntityEvent
    [EventType.SelectEntities]: SelectEntitiesEvent
    [EventType.SelectEntitiesChange]: SelectEntitiesEvent
    [EventType.SaveProject]: WorldEvent
    [EventType.ExtensionUpdated]: WorldEvent
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
