'use strict'

const eachLimit = require('async/eachLimit')
const TestNet = require('./src/test-net')
const IpfsHost = require('./src/ipfs-host')

const testNet = new TestNet({
  hostConfig: {
    image: 'jgantunes/js-ipfs:latest',
    cmd: '/bin/sh'
  },
  host: IpfsHost
})

testNet.bootstrapNetwork(require('./networks/ring'))

testNet.start((err) => {
  if (err) throw err
  console.log('Test net running')

  eachLimit(testNet.hosts, 5, (host, done) => {
    host.exec('jsipfs swarm peers', (err, stream) => {
      if (err) return done(err)
      console.log(`**Peers ${host.id}**`)
      stream.pipe(process.stdout)
      stream.on('end', done)
    })
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
