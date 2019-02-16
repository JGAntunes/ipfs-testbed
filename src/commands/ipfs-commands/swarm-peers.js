#!/usr/bin/env node
'use strict'

const ipfsClient = require('ipfs-http-client')

const { getRandomElement } = require('../../../lib/utils')
const k8sClient = require('../../../lib/kubernetes-client')

const cmd = {
  command: 'swarm peers [node-id]',
  desc: 'execute a get swarm peers from [node-id] or a random node',
  builder: (yargs) => {
    yargs.positional('node-id', {
      describe: 'node to execute the command at',
      type: 'string'
    })
  },
  handler: async ({ fromNodeId, toNodeId, count }) => {
    const res = await k8sClient.getNodeInfo({ nodeId: fromNodeId })
    const node = getRandomElement(res)
    if (!node) return
    const ipfs = ipfsClient(node.hosts.ipfsAPI)
    console.log({ name: node.name, id: node.id })
    const peers = await ipfs.swarm.peers()
    console.log(peers)
  }
}

module.exports = cmd
