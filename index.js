'use strict'

const TestNet = require('./src/test-net')

const testNet = new TestNet({
  hostConfig: {
    image: 'jgantunes/js-ipfs:latest',
    cmd: './init-and-daemon.sh'
  },
  hostNumber: 3,
  switchesNumber: 3
})

testNet.bootstrapNetwork({
  s1: [
    's2',
    's3',
    'd1',
  ],
  s2: [
    's1',
    's3',
    'd2',
  ],
  s3: [
    's2',
    's1',
    'd3',
  ]
})

testNet.start((err) => {
  if (err) throw err
  console.log('Bootstrap finished')
  testNet.getNode('d1').exec(`jsipfs ping ${testNet.getNode('d2').ipfsConfig.id}`, (err, result) => console.log(result))
  testNet.getNode('d1').exec('jsipfs id', (err, result) => console.log(result))
})
