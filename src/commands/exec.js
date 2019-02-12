#!/usr/bin/env node
'use strict'

const cmd = {
  command: 'exec <command..>',
  desc: 'exec <command> in a IPFS Node',
  builder: (yargs) => {
    yargs.commandDir('ipfs-commands')
  },
  handler: () => {}
}

module.exports = cmd
