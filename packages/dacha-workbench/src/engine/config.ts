import type { Config, GlobalOption } from 'remiz'

import { SHAPE_CANVAS_ROOT } from '../consts/root-nodes'
import {
  TOOL_CURSOR_MOVE_MSG,
  TOOL_CURSOR_LEAVE_MSG,
  SELECTION_MOVE_MSG,
  SELECTION_MOVE_START_MSG,
  SELECTION_MOVE_END_MSG,
  ADD_FROM_TEMPLATE_MSG,
} from '../consts/message-types'

interface EditorConfigOptions {
  globalOptions: Array<GlobalOption>
}

export const getEditorConfig = ({
  globalOptions,
}: EditorConfigOptions): Config => ({
  scenes: [
    {
      id: '0481caa3-c28c-40cc-a1f8-0f2496f1c403',
      name: 'editor',
      levelId: 'cd42a993-f3c0-4921-b867-108c81028a26',
      systems: [
        {
          name: 'keyboardInputSystem',
          options: {},
        },
        {
          name: 'mouseInputSystem',
          options: {
            windowNodeId: 'canvas-root',
          },
        },
        {
          name: 'mouseInputCoordinatesProjector',
          options: {},
        },
        {
          name: 'keyboardControlSystem',
          options: {},
        },
        {
          name: 'mouseControlSystem',
          options: {},
        },
        {
          name: 'projectLoader',
          options: {},
        },
        {
          name: 'levelViewer',
          options: {
            mainObjectId: 'main-object',
          },
        },
        {
          name: 'settingsSystem',
          options: {},
        },
        {
          name: 'toolManager',
          options: {},
        },
        {
          name: 'zoomToolSystem',
          options: {},
        },
        {
          name: 'handToolSystem',
          options: {},
        },
        {
          name: 'pointerToolSystem',
          options: {},
        },
        {
          name: 'templateToolSystem',
          options: {},
        },
        {
          name: 'commander',
          options: {},
        },
        {
          name: 'cameraSystem',
          options: {
            windowNodeId: 'canvas-root',
            initialCamera: 'main-object',
            scaleSensitivity: 0.5,
          },
        },
        {
          name: 'uiBridge',
          options: {
            filterComponents: [],
          },
        },
        {
          name: 'renderer',
          options: {
            windowNodeId: 'canvas-root',
            backgroundColor: '#ffffff',
            backgroundAlpha: 0,
          },
        },
        {
          name: 'shapesRenderer',
          options: {
            windowNodeId: SHAPE_CANVAS_ROOT,
          },
        },
        {
          name: 'gridSystem',
          options: {},
        },
      ],
    },
  ],
  levels: [
    {
      id: 'cd42a993-f3c0-4921-b867-108c81028a26',
      name: 'level-viewer',
      gameObjects: [
        {
          id: 'main-object',
          name: 'mainCamera',
          children: [
            {
              id: 'hand',
              name: 'hand',
              children: [],
              components: [
                {
                  name: 'tool',
                  config: {
                    name: 'hand',
                    features: {},
                    inputBindings: [
                      {
                        event: 'MOUSE_LEFT_BUTTON_PRESS',
                        messageType: 'CAMERA_MOVE_START',
                        attrs: [],
                      },
                      {
                        event: 'MOUSE_LEFT_BUTTON_RELEASE',
                        messageType: 'CAMERA_MOVE_END',
                        attrs: [],
                      },
                      {
                        event: 'MOUSE_MOVE',
                        messageType: 'CAMERA_MOVE',
                        attrs: [],
                      },
                      {
                        event: 'MOUSE_LEAVE',
                        messageType: 'CAMERA_MOVE_END',
                        attrs: [],
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: 'zoom',
              name: 'zoom',
              children: [],
              components: [
                {
                  name: 'tool',
                  config: {
                    name: 'zoom',
                    features: {
                      direction: {
                        value: 'in',
                        withClassName: true,
                      },
                    },
                    inputBindings: [
                      {
                        event: 'MOUSE_LEFT_BUTTON_PRESS',
                        messageType: 'CAMERA_ZOOM',
                        attrs: [],
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: 'pointer',
              name: 'pointer',
              children: [],
              components: [
                {
                  name: 'tool',
                  config: {
                    name: 'pointer',
                    features: {
                      grid: {
                        value: false,
                        withClassName: false,
                      },
                    },
                    inputBindings: [
                      {
                        event: 'MOUSE_LEFT_BUTTON_PRESS',
                        messageType: SELECTION_MOVE_START_MSG,
                        attrs: [],
                      },
                      {
                        event: 'MOUSE_MOVE',
                        messageType: SELECTION_MOVE_MSG,
                        attrs: [],
                      },
                      {
                        event: 'MOUSE_LEFT_BUTTON_RELEASE',
                        messageType: SELECTION_MOVE_END_MSG,
                        attrs: [],
                      },
                      {
                        event: 'MOUSE_LEAVE',
                        messageType: SELECTION_MOVE_END_MSG,
                        attrs: [],
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: 'template',
              name: 'template',
              children: [],
              components: [
                {
                  name: 'tool',
                  config: {
                    name: 'template',
                    features: {
                      preview: {
                        value: true,
                        withClassName: false,
                      },
                      grid: {
                        value: false,
                        withClassName: false,
                      },
                      templateId: {
                        value: undefined,
                        withClassName: false,
                      },
                    },
                    inputBindings: [
                      {
                        event: 'MOUSE_LEFT_BUTTON_CLICK',
                        messageType: ADD_FROM_TEMPLATE_MSG,
                        attrs: [],
                      },
                    ],
                  },
                },
              ],
            },
          ],
          components: [
            {
              name: 'transform',
              config: {
                offsetX: 0,
                offsetY: 0,
                offsetZ: 1,
                rotation: 0,
              },
            },
            {
              name: 'camera',
              config: {
                zoom: 1,
              },
            },
            {
              name: 'mouseControl',
              config: {
                inputEventBindings: [
                  {
                    event: 'MOUSE_MOVE',
                    messageType: TOOL_CURSOR_MOVE_MSG,
                    attrs: [],
                  },
                  {
                    event: 'MOUSE_LEAVE',
                    messageType: TOOL_CURSOR_LEAVE_MSG,
                    attrs: [],
                  },
                ],
              },
            },
            {
              name: 'toolController',
              config: {
                activeTool: 'hand',
              },
            },
            {
              name: 'settings',
              config: {
                showGrid: false,
                gridStep: 16,
                gridColor: '#1890FF',
              },
            },
          ],
        },
      ],
    },
  ],
  templates: [
    {
      id: 'frame',
      name: 'frame',
      type: '',
      children: [],
      components: [
        {
          name: 'transform',
          config: {
            offsetX: 0,
            offsetY: 0,
            offsetZ: 0,
            rotation: 0,
          },
        },
        {
          name: 'shape',
          config: {
            type: 'rectangle',
            properties: {
              width: 0,
              height: 0,
              color: 'rgba(0, 0, 0, 0)',
              strokeWidth: 2,
              strokeColor: '#fff',
            },
          },
        },
      ],
    },
  ],
  loaders: [],
  globalOptions: [
    ...globalOptions,
  ],
  startSceneId: '0481caa3-c28c-40cc-a1f8-0f2496f1c403',
})
