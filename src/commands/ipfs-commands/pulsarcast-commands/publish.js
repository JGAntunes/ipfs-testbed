#!/usr/bin/env node
'use strict'

const k8sClient = require('../../../../lib/kubernetes-client')
const { getRandomElement } = require('../../../../lib/utils')
const ipfsClient = require('ipfs-http-client')

const cmd = {
  command: 'publish <topic-cid> <message> [node-id]',
  desc: 'publish <message> at <topic-cid> from [node-id] or a random node',
  builder: (yargs) => {
    yargs.positional('topic-cid', {
      describe: 'topic cid',
      type: 'string'
    }).positional('message', {
      describe: 'meesage to publish',
      type: 'string'
    }).positional('node-id', {
      describe: 'node to execute the command at',
      type: 'string'
    })
  },
  handler: async ({ topicCid, message, nodeId }) => {
    const res = await k8sClient.getNodeInfo({ nodeId })
    const node = getRandomElement(res)
    if (!node) return
    const ipfs = ipfsClient(node.hosts.ipfsAPI)
    await ipfs.pulsarcast.publish(topicCid, Buffer.from(message))
    console.log({ name: node.name, id: node.id })
  }
}

module.exports = cmd
