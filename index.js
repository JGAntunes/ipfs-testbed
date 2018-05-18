'use strict'

const TestNet = require('./src/test-net')
const IpfsHost = require('./src/ipfs-host')

const testNet = new TestNet({
  hostConfig: {
    image: 'jgantunes/js-ipfs:latest',
    cmd: '/bin/sh'
  },
  host: IpfsHost
})

const network = require('./networks/disconnected')

// TODO proper logging
const log = console

testNet.bootstrapNetwork(network)

testNet.start((err) => {
  if (err) throw err
  log.info('Test net running')
})
