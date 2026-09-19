#!/usr/bin/env node

const path = require('path');
const { parseArgs } = require('util');
const readline = require('readline/promises');

const { create } = require('../lib/create');

const DEFAULT_NAME = 'my-game';

const promptForName = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const answer = await rl.question(`Project name: (${DEFAULT_NAME}) `);
    return answer.trim() || DEFAULT_NAME;
  } finally {
    rl.close();
  }
};

const main = async () => {
  const { positionals } = parseArgs({ allowPositionals: true });

  const name = positionals[0] ?? (await promptForName());
  const targetDir = path.resolve(name);

  create({ targetDir });

  const relative = path.relative(process.cwd(), targetDir);
  const cdTarget =
    relative && !relative.startsWith('..') ? relative : targetDir;

  console.warn(`\nCreated ${targetDir}\n`);
  console.warn('Next:\n');
  console.warn(`  cd ${cdTarget}`);
  console.warn('  npm install');
  console.warn('  npm run dev\n');
  console.warn('Open the editor with `npm run editor`.\n');
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
