'use strict'

const eachLimit = require('async/eachLimit')
const containernet = require('containernet')

const cn = containernet()

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
    cn.start((err) => {
      if (err) throw err
      eachLimit(this.hosts, 15, getHostId, cb)
      console.log('Test net running')
    })
  }

  getNode (id) {
    const type = id[0]
    const number = Number(id[1]) - 1 // Damn you arrays
    if (type === 's') {
      return this.switches[number]
    } else if (type === 'd') {
      return this.hosts[number]
    }
    return null
  }
}

function getHostId (host, done) {
  host.exec('jsipfs id', (err, result) => {
    if (err) return done(err)
    try {
      host.ipfsConfig = JSON.parse(result)
    } catch (e) {
      return done(e)
    }
    console.log(`Running node with id ${host.ipfsConfig.id}`)
    done()
  })
}

module.exports = TestNet
