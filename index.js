'use strict'

const TestNet = require('./src/test-net')
const IpfsHost = require('./src/ipfs-host')
const { log, streamToLogger } = require('./src/utils/logger')

const testNet = new TestNet({
  hostConfig: {
    image: 'jgantunes/js-ipfs:latest',
    cmd: '/bin/sh'
  },
  host: IpfsHost
})

const network = require('./networks/tiny')

testNet.bootstrapNetwork(network)

let hostsReady = 0
let hostsConnected = 0

// Emit global host events
testNet.hosts.forEach((host) => {
  const hostReady = (err) => {
    if (err) log.error(err)
    hostsReady++
    // Emit ready:hosts if all hosts are ready
    if (hostsReady === testNet.hosts.length) {
      testNet.emit('ready:hosts')
      // Emit ready for consistency
      testNet.emit('ready')
    }
    host.removeListener('ready', hostReady)
    host.removeListener('error', hostReady)
  }

  const connected = () => {
    hostsConnected++
    // Emit connected if all hosts are connected
    if (hostsConnected === testNet.hosts.length) {
      testNet.emit('connected')
    }
  }

  host.once('ready', hostReady)
  host.once('error', hostReady)
  host.once('connected', connected)
})

testNet.start((err) => {
  if (err) throw err
  log.info('Test net running')
})

testNet.on('connected', () => {
  log.info('Hosts connected, executing scripts')
  testNet.hosts.forEach((host) => {
    const hostConfig = network.hosts[host.id]
    if (!hostConfig || !hostConfig.script) return
    hostConfig.script.forEach((command) => {
      host.exec(command, (err, stream) => {
        if (err) host.log.error(err)
        streamToLogger(host.log, stream)
      })
    })
  })
})
