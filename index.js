'use strict'

const eachLimit = require('async/eachLimit')
const pull = require('pull-stream')
const toPull = require('stream-to-pull-stream')
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

testNet.start((err) => {
  if (err) throw err
  console.log('Test net running')

  // Object.values(testNet.hosts).forEach((host) => console.log(JSON.stringify(host.ipfs, null, 3)))

  eachLimit(testNet.hosts, 3, (host, done) => {
    setupNode(host, network.hosts[host.id].ipfs, done)
  }, (err) => {
    if (err) console.log(err)
    console.log('Done')
  })
  // testNet.getNode('d1').exec('jsipfs pubsub sub batata', (err, stream) => stream.pipe(process.stdout))
  // setTimeout(() => {
  //   testNet.getNode('d2').exec('jsipfs pubsub pub batata frita', (err, stream) => stream.pipe(process.stdout))
  // }, 500)
  // testNet.getNode('d1').exec(`jsipfs ping ${testNet.getNode('d2').ipfsConfig.id}`, (err, result) => console.log(result))
  // testNet.getNode('d1').exec('jsipfs id', (err, result) => console.log(result))
})

function setupNode (host, config, done) {
  // For now the only setup we do is connections
  if (!config.peers) return done()
  const peers = Array.isArray(config.peers) ? config.peers : [config.peers]
  eachLimit(peers, 3, (hostId, cb) => {
    const peerMultiaddr = testNet.getNode(hostId).ipfs.addresses.find((multiaddr) => {
      // We want a tcp multiaddr not bound to the loopback interface
      return !multiaddr.includes('127.0.0.1') && multiaddr.includes('tcp')
    })
    host.exec(`jsipfs swarm connect ${peerMultiaddr}`, (err, stream) => {
      if (err) return cb(err)
      pull(
        toPull.source(stream),
        pull.concat((err, result) => {
          if (err) return cb(err)
          if (result.includes('Error')) return cb(result)
          log.info(`Peer ${host.id}:${host.ipfs.id} ${result}`)
          cb()
        })
      )
    })
  }, done)
}
