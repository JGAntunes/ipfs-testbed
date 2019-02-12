#!/usr/bin/env node
'use strict'

const cmd = {
  command: 'create <resources..>',
  desc: 'creates the given resources',
  builder: (yargs) => {
    yargs.commandDir('create-commands')
  },
  handler: () => {}
}

module.exports = cmd
