#!/usr/bin/env node
'use strict'

const cmd = {
  command: ['toxic <resources..>', 'toxics <resources..>'],
  desc: 'creates the given toxic resources',
  builder: (yargs) => {
    yargs.commandDir('toxic-commands')
  },
  handler: () => {}
}

module.exports = cmd
