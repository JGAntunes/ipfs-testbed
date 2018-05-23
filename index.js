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

const network = require('./networks/tiny')

// TODO proper logging
const log = console

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
  log.info('subscribe')
  testNet.getNode('d1').exec('jsipfs pubsub sub batata', (err, stream) => {
    if (err) throw err
    log.info('publish')
    stream.pipe(process.stdout)
    setTimeout(() => {
      testNet.getNode('d2').exec('jsipfs pubsub pub batata d2', (err, stream) => {
        if (err) throw err
        stream.pipe(process.stdout)
      })
      testNet.getNode('d3').exec('jsipfs pubsub pub batata d3', (err, stream) => {
        if (err) throw err
        stream.pipe(process.stdout)
      })
    }, 300)
  })
})
