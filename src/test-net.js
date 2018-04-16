'use strict'

const eachLimit = require('async/eachLimit')
const containernet = require('containernet')
const pull = require('pull-stream')
const toPull = require('stream-to-pull-stream')

const cn = containernet()

const log = console

class TestNet {
  constructor ({hostConfig = {}, hostNumber, switchesNumber} = {}) {
    this.switches = []
    this.hosts = []
    this.hostNumber = hostNumber
    this.switchesNumber = switchesNumber
    this.hostConfig = hostConfig
    this.running = false
  }

  bootstrapNetwork (links) {
    for (let i = this.hosts.length; i < this.hostNumber; i++) {
      this.createHost()
    }

    for (let i = this.switches.length; i < this.switchesNumber; i++) {
      this.createSwitch()
    }

    Object.entries(links).forEach(([from, to]) => {
      to.forEach(node => {
        this.link(from, node)
      })
    })
  }

  createSwitch () {
    this.switches.push(cn.createSwitch())
  }

  createHost () {
    this.hosts.push(cn.createHost(this.hostConfig))
  }

  link (from, to) {
    this.getNode(from).link(this.getNode(to))
  }

  start (cb) {
    log.info('Starting test net')
    cn.start((err) => {
      if (err) throw err

      // Set the cleanup handlers
      const exitHandler = () => {
        log.info('Cleanup successful')
      }
      process.on('SIGINT', this.stop.bind(this, exitHandler))
      process.on('SIGTERM', this.stop.bind(this, exitHandler))
      process.on('SIGHUP', this.stop.bind(this, exitHandler))

      // Hold for the daemons to be ready
      setTimeout(() => {
        eachLimit(this.hosts, 15, getHostId, cb)
        log.info('Test net running')
      }, 5000)
    })
  }

  stop (cb) {
    log.info('Stopping test net')
    cn.stop(cb)
  }

  getNode (id) {
    const type = id[0]
    const number = Number(id.slice(1)) - 1 // Damn you arrays
    if (type === 's') {
      return this.switches[number]
    } else if (type === 'd') {
      return this.hosts[number]
    }
    return null
  }
}

function getHostId (host, done) {
  host.exec('jsipfs id', (err, stream) => {
    if (err) return done(err)
    pull(
      toPull.source(stream),
      pull.concat((err, result) => {
        if (err) return done(err)
        try {
          host.ipfsConfig = JSON.parse(result)
        } catch (e) {
          log.error('Failed to parse jsipfs id response', result)
          return done()
        }
        log.info(`Running node with id ${host.ipfsConfig.id}`)
        done()
      })
    )
  })
}

module.exports = TestNet
