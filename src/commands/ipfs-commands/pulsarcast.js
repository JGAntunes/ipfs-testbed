#!/usr/bin/env node
'use strict'

const cmd = {
  command: 'pulsarcast <command>',
  desc: 'exec pulsarcast <command> in this IPFS Node',
  builder: (yargs) => {
    yargs.commandDir('pulsarcast-commands')
  },
  handler: () => {}
}

module.exports = cmd
