'use strict'

const k8s = require('@kubernetes/client-node')

const config = require('../config').kubernetes

const kc = new k8s.KubeConfig()
kc.loadFromDefault()

const k8sApiCore = kc.makeApiClient(k8s.Core_v1Api)
const k8sApiApps = kc.makeApiClient(k8s.Apps_v1Api)

function handleErrorCode (res) {
  const statusCode = res.response.statusCode
  if (statusCode >= 400) {
    throw new Error(`Got ${statusCode} from k8s client - ${JSON.stringify(res.body, null, 2)}`)
  }
}

async function getNodes () {
  const res = await k8sApiCore.listNode()
  handleErrorCode(res)
  return res.body
}

async function getServices ({ namespace, labelSelector }) {
  const res = await k8sApiCore.listNamespacedService(namespace, null, null, null, null, labelSelector)
  handleErrorCode(res)
  return res.body
}

async function getDeployments ({ namespace, labelSelector }) {
  const res = await k8sApiApps.listNamespacedDeployment(namespace, null, null, null, null, labelSelector)
  handleErrorCode(res)
  return res.body
}

async function getNodeInfo ({ namespace = 'ipfs-testbed', labelSelector = 'app.kubernetes.io/name=ipfs-testbed', nodeId } = {}) {
  if (nodeId) labelSelector = `${labelSelector},ipfs-testbed/ipfs-id=${nodeId}`
  const [nodes, services, deployments] = await Promise.all([
    getNodes(),
    getServices({ namespace, labelSelector }),
    getDeployments({ namespace, labelSelector })
  ])
  // Using the first node for now
  const addresses = nodes.items[0].status.addresses
  // Look for an ExternalIP, else look for a Hostname, else look for an InternalIP
  let ad = addresses.find((address) => address.type === 'ExternalIP')
  if (!ad) ad = addresses.find((address) => address.type === 'Hostname')
  if (!ad) ad = addresses.find((address) => address.type === 'InternalIP')
  // Get the ports for each service
  return services.items.map(service => {
    const ports = {
      swarm: service.spec.ports.find(port => port.name === config.swarmPortName),
      ipfsAPI: service.spec.ports.find(port => port.name === config.ipfsPortName),
      toxiproxyAPI: service.spec.ports.find(port => port.name === config.toxiproxyPortName)
    }
    return {
      // Name and id will be the same across all resources
      id: service.metadata.labels['ipfs-testbed/ipfs-id'],
      // Name will be the same across all resources
      name: service.metadata.name,
      hosts: {
        swarm: {
          host: ad.address,
          port: ports.swarm.nodePort
        },
        ipfsAPI: {
          host: ad.address,
          port: ports.ipfsAPI.nodePort
        },
        toxiproxyAPI: {
          host: ad.address,
          port: ports.toxiproxyAPI.nodePort
        }
      }
    }
  })
}

module.exports = {
  getNodeInfo
}
