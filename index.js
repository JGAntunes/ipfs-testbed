'use strict'

const TestNet = require('./src/test-net')

const testNet = new TestNet({
  hostConfig: {
    image: 'jgantunes/js-ipfs:latest',
    cmd: './init-and-daemon.sh'
  },
  hostNumber: 6,
  switchesNumber: 3
})

testNet.bootstrapNetwork({
  s1: [
    's2',
    's3',
    'd1',
    'd2'
  ],
  s2: [
    's1',
    's3',
    'd3',
    'd4'
  ],
  s3: [
    's2',
    's1',
    'd5',
    'd6'
  ]
})

testNet.start(() => console.log('Test net running'))
