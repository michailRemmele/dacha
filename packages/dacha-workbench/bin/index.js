#!/usr/bin/env node

const { exec } = require('child_process')
const path = require('path')

process.env.NODE_ENV = 'production'

exec(`electron ${path.join(__dirname, '../')}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`)
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`)
    return
  }

  console.log(`stdout:\n${stdout}`)
})
