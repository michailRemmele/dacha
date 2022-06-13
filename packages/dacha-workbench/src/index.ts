import {
  Engine,
  contribComponents,
  contribSystems,
} from 'remiz'

import config from './engine/config.json'
import { editorSystems, helpers } from './engine'

const editorEngine = new Engine({
  config,
  systems: {
    ...contribSystems,
    ...editorSystems,
  },
  components: {
    ...contribComponents,
  },
  helpers,
})

void editorEngine.start()
