const bunyan = require('bunyan')
const pullSplit = require('pull-split')
const pull = require('pull-stream')
const toPull = require('stream-to-pull-stream')

const log = bunyan.createLogger({
  name: 'ipfs-test-harness',
  level: 'trace',
  stream: process.stdout,
  serializers: {
    host: hostSerializer
  }
})

function hostSerializer (host) {
  return {
    peerId: host.ipfs && host.ipfs.id,
    host: host.id
  }
}

function streamToLogger (logger, stream) {
  const pStream = toPull.source(stream)
  pull(
    pStream,
    pullSplit('\n'),
    pull.drain(
      (data) => {
        if (data) logger.info(data)
      },
      (err) => {
        if (err) logger.error(err)
      }
    )
  )
}

module.exports = {
  log,
  streamToLogger
}
