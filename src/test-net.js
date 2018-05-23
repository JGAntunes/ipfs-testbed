'use strict'

const EventEmitter = require('events')
const containernet = require('containernet')

// TODO proper logging
const log = console

class TestNet extends EventEmitter {
  constructor ({host, hostConfig = {}} = {}) {
    super()
    this.switches = []
    this.hosts = []
    this.defaultHostConfig = hostConfig
    this.host = host
    this.running = false
    this._cn = containernet()
  }

  bootstrapNetwork (network) {
    for (let i = this.hosts.length; i < network.hosts.number; i++) {
      const hostConfig = network.hosts[`d${i + 1}`]
      this.createHost(hostConfig)
    }

    for (let i = this.switches.length; i < network.switches.number; i++) {
      this.createSwitch()
    }

    Object.entries(network.links).forEach(([from, to]) => {
      to.forEach(node => {
        this.link(from, node)
      })
    })
  }

  createSwitch () {
    this.switches.push(this._cn.createSwitch())
  }

  createHost (hostConfig) {
    const config = Object.assign({}, this.defaultHostConfig, hostConfig)
    this.hosts.push(this.host.create(this, config))
  }

  link (from, to) {
    this.getNode(from).link(this.getNode(to))
  }

  start (cb) {
    log.info('Starting test net')
    this._cn.start((err) => {
      if (err) throw err

      // Set the cleanup handlers
      const exitHandler = () => {
        log.info('Cleanup successful')
      }
      process.on('SIGINT', this.stop.bind(this, exitHandler))
      process.on('SIGTERM', this.stop.bind(this, exitHandler))
      process.on('SIGHUP', this.stop.bind(this, exitHandler))

      // Let the hosts and apps know we're ready
      this.emit('ready:network')

      this.running = true
      log.info('Test net running')
    })
  }

  stop (cb) {
    log.info('Stopping test net')
    this._cn.stop(cb)
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

module.exports = TestNet
