'use strict'

const eachLimit = require('async/eachLimit')
const containernet = require('containernet')

// TODO proper logging
const log = console

class TestNet {
  constructor ({host, hostConfig = {}} = {}) {
    this.switches = []
    this.hosts = []
    this.hostConfig = hostConfig
    this.host = host
    this.running = false
    this._cn = containernet()
  }

  bootstrapNetwork (hostsNum, switchesNum, links) {
    for (let i = this.hosts.length; i < hostsNum; i++) {
      this.createHost()
    }

    for (let i = this.switches.length; i < switchesNum; i++) {
      this.createSwitch()
    }

    Object.entries(links).forEach(([from, to]) => {
      to.forEach(node => {
        this.link(from, node)
      })
    })
  }

  createSwitch () {
    this.switches.push(this._cn.createSwitch())
  }

  createHost () {
    this.hosts.push(this.host.create(this._cn, this.hostConfig))
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

      eachLimit(this.hosts, 15, (host, done) => host.start(done), cb)

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
