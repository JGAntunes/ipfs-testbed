#!/usr/bin/env node
'use strict'

const k8sClient = require('../../../../lib/kubernetes-client')
const ipfsClient = require('ipfs-http-client')

const cmd = {
  command: 'subscribe <topic-cid> <node-id>',
  desc: 'subscribe to <topic-cid> from <from-node-id>',
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
    const ipfs = ipfsClient(res[0].hosts.ipfsAPI)
    await ipfs.pulsarcast.subscribe(topicCid)
  }
}

module.exports = cmd
