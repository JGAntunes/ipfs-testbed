#!/usr/bin/env node
'use strict'

const k8sClient = require('../../../../lib/kubernetes-client')
const ipfsClient = require('ipfs-http-client')

const cmd = {
  command: 'publish <topic-cid> <message> <node-id>',
  desc: 'publish <message> at <topic-cid> from <from-node-id>',
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
    const ipfs = ipfsClient(res[0].hosts.ipfsAPI)
    await ipfs.pulsarcast.publish(topicCid, Buffer.from(message))
  }
}

module.exports = cmd
