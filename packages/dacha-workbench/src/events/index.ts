import type {
  SceneEvent,
  MouseControlEvent,
} from 'remiz'

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

export type CommandEvent = SceneEvent<{
  command: string
  scope: string
  isEffect?: boolean
  options: unknown
}>

export type CommandUndoEvent = SceneEvent<{
  scope: string
}>

export type CommandRedoEvent = SceneEvent<{
  scope: string
}>

export type CommandCleanEvent = SceneEvent<{
  scope: string
}>

declare module 'remiz' {
  export interface SceneEventMap {
    [EventType.SelectTool]: SelectToolEvent
    [EventType.SetToolFeatureValue]: SetToolFeatureValueEvent
    [EventType.SetSettingsValue]: SetSettingsValueEvent
    [EventType.SelectLevel]: SelectLevelEvent
    [EventType.InspectEntity]: InspectEntityEvent
    [EventType.InspectedEntityChange]: InspectEntityEvent
    [EventType.Command]: CommandEvent
    [EventType.CommandUndo]: CommandUndoEvent
    [EventType.CommandRedo]: CommandRedoEvent
    [EventType.CommandClean]: CommandCleanEvent
    [EventType.SaveProject]: SceneEvent
  }

  export interface GameObjectEventMap {
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
