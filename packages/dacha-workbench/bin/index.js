#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { Command } = require('commander');

const init = require('./init');
const { getExecPath } = require('./utils/get-app-paths');

const isDev = process.env.NODE_ENV === 'development';

const program = new Command();

program.description('CLI to GUI editor for Dacha game engine');

program
  .command('init')
  .description('Create initial project structure to run editor')
  .action(init);

program
  .option(
    '--config <string>',
    'Path to configuration file for editor',
    path.resolve('dacha-workbench.config.js'),
  )
  .action((options) => {
    if (options.config === undefined || !fs.existsSync(options.config)) {
      console.error(
        'Cannot find configuration file. Use --config option to specify path to configuration file.',
      );
      process.exit(1);
    }

    process.env.EDITOR_CONFIG = options.config;
    // Save original project CWD
    // to allow to specify relative project paths (assets, entryPoint, etc.)
    process.env.ORIGINAL_CWD = process.cwd();

    let electron;
    if (isDev) {
      // Run application in development mode using electron CLI
      electron = spawn(
        process.platform === 'win32' ? 'electron.cmd' : 'electron',
        [path.join(__dirname, '../index')],
        { shell: true },
      );
    } else {
      // Run application in production mode using binary package.
      electron = spawn(path.join(__dirname, '../build-app', getExecPath()));
    }

    electron.stdout.on('data', (data) => {
      // eslint-disable-next-line no-console
      console.log(`stdout: ${data}`);
    });

    electron.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    electron.on('close', (data) => {
      console.error(`child process exited with code: ${data}`);
    });
  });

program.parse(process.argv);
