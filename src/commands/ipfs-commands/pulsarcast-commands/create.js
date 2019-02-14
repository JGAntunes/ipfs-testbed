#!/usr/bin/env node
'use strict'

const k8sClient = require('../../../../lib/kubernetes-client')
const ipfsClient = require('ipfs-http-client')

const cmd = {
  command: 'create <topic-name> <node-id>',
  desc: 'create a topic with name <topic-name> from <from-node-id>',
  builder: (yargs) => {
    yargs.positional('topic-name', {
      describe: 'topic name',
      type: 'string'
    }).positional('node-id', {
      describe: 'node to execute the command at',
      type: 'string'
    })
  },
  handler: async ({ topicName, nodeId }) => {
    const res = await k8sClient.getNodeInfo({ nodeId })
    const ipfs = ipfsClient(res[0].hosts.ipfsAPI)
    await ipfs.pulsarcast.createTopic(topicName)
  }
}

module.exports = cmd
