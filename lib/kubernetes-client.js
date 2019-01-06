'use strict'

const k8s = require('@kubernetes/client-node')

const config = require('../config').kubernetes

const kc = new k8s.KubeConfig()
kc.loadFromDefault()

const k8sApi = kc.makeApiClient(k8s.Core_v1Api)

function handleErrorCode (res) {
  const statusCode = res.response.statusCode
  if (statusCode >= 400) {
    throw new Error(`Got ${statusCode} from k8s client - ${JSON.stringify(res.body, null, 2)}`)
  }
}

async function getNodes () {
  const res = await k8sApi.listNode()
  handleErrorCode(res)
  return res.body
}

async function getServices () {
  const res = await k8sApi.listNamespacedService(config.namespace, null, null, null, null, config.labelSelector)
  handleErrorCode(res)
  return res.body
}

async function getHostUrls () {
  const [nodes, services] = await Promise.all([
    getNodes(),
    getServices()
  ])
  // Using the first node for now
  const addresses = nodes.items[0].status.addresses
  // Look for an Hostname, else look for an ExternalIP, else look for an InternalIP
  let ad = addresses.find((address) => address.type === 'Hostname')
  if (!ad) ad = addresses.find((address) => address.type === 'ExternalIP')
  if (!ad) ad = addresses.find((address) => address.type === 'InternalIP')
  // Get the ports for each service
  return services.items.map(service => {
    const ports = {
      swarm: service.spec.ports.find(port => port.name === config.swarmPortName),
      ipfsAPI: service.spec.ports.find(port => port.name === config.ipfsPortName),
      toxiproxyAPI: service.spec.ports.find(port => port.name === config.toxiproxyPortName)
    }
    return {
      name: service.metadata.name,
      hosts: {
        swarm: `${ad.address}:${ports.swarm.nodePort}`,
        ipfsAPI: `${ad.address}:${ports.ipfsAPI.nodePort}`,
        toxiproxyAPI: `${ad.address}:${ports.toxiproxyAPI.nodePort}`
      }
    }
  })
}

// async function main () {
//   // const res = await k8sApi.listNamespacedPod('default')
//   // console.log(JSON.stringify(res.body, null, 2))
//   const res = await getHostUrls()
//   console.log(JSON.stringify(res, null, 2))
// }

// main()

module.exports = {
  getHostUrls
}
