#!/usr/bin/env node
'use strict'

const pull = require('pull-stream')

const k8sClient = require('../../../lib/kubernetes-client')
const ipfsClient = require('ipfs-http-client')

const cmd = {
  command: 'ping <to-node-id> <from-node-id>',
  desc: 'execute a ping <to-node-id> from <from-node-id>',
  builder: (yargs) => {
    yargs.positional('to-node-id', {
      describe: 'node to ping',
      type: 'string'
    }).positional('from-node-id', {
      describe: 'node to execute the command at',
      type: 'string'
    }).options('count', {
      describe: 'packet count to send',
      alias: 'n',
      type: 'number',
      default: 10
    })
  },
  handler: async ({ fromNodeId, toNodeId, count }) => {
    const res = await k8sClient.getNodeInfo({ nodeId: fromNodeId })
    const ipfs = ipfsClient(res[0].hosts.ipfsAPI)
    pull(
      ipfs.pingPullStream(toNodeId, { count }),
      pull.log()
    )
  }
}

module.exports = cmd
