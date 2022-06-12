#!/usr/bin/env node

const { spawn } = require('child_process')
const path = require('path')
const { program } = require('commander')

program
  .option('--config <string>', 'Path to configuration file for editor', 'remiz-editor.config.js')

program.parse()

process.env.EDITOR_CONFIG = program.opts().config

const electron = spawn('electron', [path.join(__dirname, '../')])

electron.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`)
})

electron.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`)
})

electron.on('close', (data) => {
  console.error(`child process exited with code: ${data}`)
})
