#!/usr/bin/env node
'use strict'

const k8sClient = require('../../../lib/kubernetes-client')

const cmd = {
  command: ['nodes [node-id]', 'node [node-id]'],
  desc: 'get node info',
  builder: {
    'node-id': {
      alias: 'nodeId'
    }
  },
  handler: async (argv) => {
    const res = await k8sClient.getNodeInfo({ nodeId: argv.nodeId })
    console.log(JSON.stringify(res, null, 2))
  }
}

module.exports = cmd
