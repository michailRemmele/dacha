#!/usr/bin/env node

const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const { Command } = require('commander')

const init = require('./init')
const { getExecPath, getResourcesPath } = require('./utils/get-app-paths')

const isDev = process.env.NODE_ENV === 'development'

const program = new Command()

program
  .description('CLI to GUI editor for remiz game engine')

program
  .command('init')
  .description('Create initial project structure to run editor')
  .action(init)

program
  .option('--config <string>', 'Path to configuration file for editor', path.resolve('remiz-editor.config.js'))
  .action((options) => {
    if (options.config === undefined || !fs.existsSync(options.config)) {
      console.error('Cannot find configuration file. Use --config option to specify path to configuration file.')
      process.exit(1)
    }

    process.env.EDITOR_CONFIG = options.config
    process.env.ORIGINAL_CWD = process.cwd()

    let electron
    if (isDev) {
      electron = spawn(
        process.platform === 'win32' ? 'electron.cmd' : 'electron',
        [path.join(__dirname, '../index')],
      )
    } else {
      electron = spawn(path.join(__dirname, '../build-app', getExecPath()), {
        cwd: path.join(__dirname, '../build-app', getResourcesPath()),
      })
    }

    electron.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })

    electron.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`)
    })

    electron.on('close', (data) => {
      console.error(`child process exited with code: ${data}`)
    })
  })

program.parse(process.argv)
