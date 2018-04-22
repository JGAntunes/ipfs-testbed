'use strict'

const TestNet = require('./src/test-net')
const IpfsHost = require('./src/ipfs-host')

const testNet = new TestNet({
  hostConfig: {
    image: 'jgantunes/js-ipfs:latest',
    cmd: './init-and-daemon.sh'
  },
  host: IpfsHost
})

testNet.bootstrapNetwork(10, 1, {
  s1: [
    'd1',
    'd2',
    'd3',
    'd4',
    'd5',
    'd6',
    'd7',
    'd8',
    'd9',
    'd10'
  ]
})

testNet.start((err) => {
  if (err) throw err
  console.log('Bootstrap finished')
  testNet.getNode('d1').exec('jsipfs pubsub sub batata', (err, stream) => stream.pipe(process.stdout))
  setTimeout(() => {
    testNet.getNode('d2').exec('jsipfs pubsub pub batata frita', (err, stream) => stream.pipe(process.stdout))
  }, 500)
  // testNet.getNode('d1').exec(`jsipfs ping ${testNet.getNode('d2').ipfsConfig.id}`, (err, result) => console.log(result))
  // testNet.getNode('d1').exec('jsipfs id', (err, result) => console.log(result))
})
