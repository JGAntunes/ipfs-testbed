'use strict'

const eachLimit = require('async/eachLimit')
const pullSplit = require('pull-split')
const pull = require('pull-stream')
const toPull = require('stream-to-pull-stream')

module.exports = {
  create: IpfsHost
}

// TODO proper logging
const log = console

function IpfsHost (testNet, hostConfig) {
  const host = testNet._cn.createHost(hostConfig)

  // Setup event handlers

  // Once the network is ready start the daemon
  testNet.once('ready:network', () => {
    host.exec('./init-and-daemon.sh', (err, stream) => {
      if (err) return host.emit(err)
      pull(
        toPull.source(stream),
        pullSplit('\n'),
        pull.filter(),
        pull.find((data) => data.includes('Daemon is ready'), (err, data) => {
          if (err) return host.emit('error', err)
          if (!data) return host.emit('error', new Error('Failed to start daemon'))
          return getHostId(host, (err) => {
            if (err) return host.emit('error', err)
            host.emit('ready')
          })
        })
      )
    })
  })

  testNet.once('ready:hosts', () => {
    // Setup the peer connections
    const config = hostConfig.ipfs
    // For now the only setup we do is connections
    if (!config.peers) return
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
    }, (err) => {
      if (err) log.error(err)
    })
  })

  return host
}

function getHostId (host, done) {
  host.exec('jsipfs id', (err, stream) => {
    if (err) return done(err)
    pull(
      toPull.source(stream),
      pull.concat((err, result) => {
        if (err) return done(err)
        try {
          host.ipfs = JSON.parse(result)
        } catch (e) {
          log.error('Failed to parse jsipfs id response', result)
          return done()
        }
        log.info(`Running node with id ${host.ipfs.id}`)
        done()
      })
    )
  })
}
