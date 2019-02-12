#!/usr/bin/env node
'use strict'

const cmd = {
  command: 'delete <resources..>',
  desc: 'delete the given resources',
  builder: (yargs) => {
    yargs.commandDir('delete-commands')
  },
  handler: () => {}
}

module.exports = cmd
