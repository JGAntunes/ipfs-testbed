'use strict'

const containernet = require('containernet')

// const cn = containernet({debug: true})
const cn = containernet()

// const s1 = cn.createSwitch()
// const d1 = cn.createHost({image: 'js-ipfs:latest', cmd: ''})
// const d2 = cn.createHost({image: 'js-ipfs:latest', cmd: ''})
// const hosts = []
// const switches = []

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
    console.log(this)
    debugger
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
    cn.start(cb)
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

module.exports = TestNet
