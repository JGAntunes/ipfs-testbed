#!/usr/bin/env node
'use strict'

const k8sClient = require('../../../lib/kubernetes-client')
const { getRandomElement } = require('../../../lib/utils')
const ipfsClient = require('ipfs-http-client')

const cmd = {
  command: 'subscribe <topic-cid> [node-id]',
  desc: 'subscribe to <topic-cid> from [node-id] or a random node',
  builder: (yargs) => {
    yargs.positional('topic-cid', {
      describe: 'topic cid',
      type: 'string'
    }).positional('node-id', {
      describe: 'node to execute the command at',
      type: 'string'
    })
  },
  handler: async ({ topicCid, nodeId }) => {
    const res = await k8sClient.getNodeInfo({ nodeId })
    const node = getRandomElement(res)
    if (!node) return
    const ipfs = ipfsClient(node.hosts.ipfsAPI)
    const response = await ipfs.pulsarcast.subscribe(topicCid)
    console.log({ name: node.name, id: node.id })
    console.log(response)
  }
}

module.exports = cmd
