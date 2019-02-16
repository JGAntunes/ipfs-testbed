#!/usr/bin/env node
'use strict'

const k8sClient = require('../../../lib/kubernetes-client')
const { getRandomElement } = require('../../../../lib/utils')
const toxiproxyClient = require('../../../lib/toxiproxy-client')

const cmd = {
  command: ['toxics <toxic> [node-id]', 'toxic <toxic> [node-id]'],
  desc: 'deletes a toxic from [node-id] (or a random node)',
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
    const node = getRandomElement(res)
    if (!node) return
    const toxics = await toxiproxyClient.deleteToxic(node.hosts.toxiproxyAPI, toxic)
    console.log({ name: node.name, id: node.id })
    console.log(toxics)
  }
}

module.exports = cmd
