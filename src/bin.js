#!/usr/bin/env node
'use strict'

require('yargs')
  .commandDir('commands')
  .demandCommand()
  .help('h')
  .alias('h', 'help')
  .completion()
  .strict()
  .argv
