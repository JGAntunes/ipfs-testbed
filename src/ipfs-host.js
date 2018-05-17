'use strict'

const pullSplit = require('pull-split')
const pull = require('pull-stream')
const toPull = require('stream-to-pull-stream')

module.exports = {
  create: IpfsHost
}

// TODO proper logging
const log = console

function IpfsHost (containernet, hostConfig) {
  const host = containernet.createHost(hostConfig)

  host.start = (cb) => {
    host.exec('./init-and-daemon.sh', (err, stream) => {
      if (err) return cb(err)
      pull(
        toPull.source(stream),
        pullSplit('\n'),
        pull.filter(),
        pull.find((data) => data.includes('Daemon is ready'), (err, data) => {
          if (err) return cb(err)
          if (!data) return cb(new Error('Failed to start daemon'))
          return getHostId(host, cb)
          // parallel([
          //   getHostId.bind(null, host),
          //   setupNode.bind(null, host, hostConfig.ipfs)
          // ], cb)
        })
      )
    })
  }

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
