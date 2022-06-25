import {
  Engine,
  contribComponents,
  contribSystems,
} from 'remiz'

import config from './engine/config.json'
import { editorSystems, editorComponents, helpers } from './engine'

const editorEngine = new Engine({
  config,
  systems: {
    ...contribSystems,
    ...editorSystems,
  },
  components: {
    ...contribComponents,
    ...editorComponents,
  },
  helpers,
})

void editorEngine.start()
