#!/usr/bin/env node
'use strict'

const k8sClient = require('../../../../lib/kubernetes-client')
const { getRandomElement } = require('../../../../lib/utils')
const toxiproxyClient = require('../../../../lib/toxiproxy-client')

const cmd = {
  command: 'latency [node-id]',
  desc: 'add latency toxic to [node-id] (or a random node) incoming conns',
  builder: (yargs) => {
    yargs.options('latency', {
      describe: 'latency (in ms) to inject',
      type: 'number',
      default: 500
    }).options('jitter', {
      describe: 'delay to +/- latencey (in ms)',
      type: 'number',
      default: 50
    }).options('stream', {
      describe: 'inject toxic upstream or downstream',
      type: 'string',
      default: 'downstream'
    })
  },
  handler: async ({ nodeId, latency, jitter, stream }) => {
    const res = await k8sClient.getNodeInfo({ nodeId: nodeId })
    const node = getRandomElement(res)
    if (!node) return
    const payload = {
      type: 'latency',
      stream,
      attributes: {
        latency,
        jitter
      }
    }
    const toxic = await toxiproxyClient.createToxic(node.hosts.toxiproxyAPI, payload)
    console.log({ name: node.name, id: node.id })
    console.log(toxic)
  }
}

module.exports = cmd
