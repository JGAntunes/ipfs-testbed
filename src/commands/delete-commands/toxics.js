#!/usr/bin/env node
'use strict'

const k8sClient = require('../../../lib/kubernetes-client')
const toxiproxyClient = require('../../../lib/toxiproxy-client')

const cmd = {
  command: ['toxics <toxic> <node-id>', 'toxic <toxic> <node-id>'],
  desc: 'deletes a toxic from <node-id>',
  builder: (yargs) => {
    yargs.positional('toxic', {
      describe: 'specific toxic to delete',
      type: 'string'
    }).positional('node-id', {
      describe: 'node to delete the resource from',
      type: 'string'
    })
  },
  handler: async ({ nodeId, toxic }) => {
    const res = await k8sClient.getNodeInfo({ nodeId: nodeId })
    const toxics = await toxiproxyClient.deleteToxic(res[0].hosts.toxiproxyAPI, toxic)
    console.log(toxics)
  }
}

module.exports = cmd
