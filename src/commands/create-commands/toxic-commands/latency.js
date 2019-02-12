#!/usr/bin/env node
'use strict'

const k8sClient = require('../../../../lib/kubernetes-client')
const toxiproxyClient = require('../../../../lib/toxiproxy-client')

const cmd = {
  command: 'latency <node-id>',
  desc: 'add latency toxic to <node-id> incoming conns',
  builder: (yargs) => {
    yargs.options('latency', {
      describe: 'latency (in ms) to inject',
      type: 'number',
      default: 500
    }).options('jitter', {
      describe: 'delay to +/- latencey (in ms)',
      type: 'number',
      default: 50
    })
  },
  handler: async ({ nodeId, latency, jitter }) => {
    const res = await k8sClient.getNodeInfo({ nodeId: nodeId })
    const payload = {
      type: 'latency',
      attributes: {
        latency,
        jitter
      }
    }
    const toxic = await toxiproxyClient.createToxic(res[0].hosts.toxiproxyAPI, payload)
    console.log(toxic)
  }
}

module.exports = cmd
