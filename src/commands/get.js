#!/usr/bin/env node
'use strict'

const cmd = {
  command: 'get <resources..>',
  desc: 'get the given resources',
  builder: (yargs) => {
    yargs.commandDir('get-commands')
  },
  handler: () => {}
}

module.exports = cmd
