#!/usr/bin/env node
'use strict'

const pull = require('pull-stream')
const ipfsClient = require('ipfs-http-client')

const { getRandomElement } = require('../../lib/utils')
const k8sClient = require('../../lib/kubernetes-client')

const cmd = {
  command: 'ping <to-node-id> [from-node-id]',
  desc: 'execute a ping <to-node-id> from [from-node-id] or a random node',
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
    const node = getRandomElement(res)
    if (!node) return
    const ipfs = ipfsClient(node.hosts.ipfsAPI)
    console.log({ name: node.name, id: node.id })
    pull(
      ipfs.pingPullStream(toNodeId, { count }),
      pull.log()
    )
  }
}

module.exports = cmd
