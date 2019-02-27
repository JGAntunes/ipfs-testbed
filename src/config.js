'use strict'

module.exports = {
  kubernetes: {
    namespace: process.env.KUBERNETES_NAMESPACE || 'default',
    labelSelector: process.env.KUBERNETES_LABEL || 'app=ipfs-testbed',
    ipfsPortName: process.env.KUBERNETES_IPFS_API_PORT || 'ipfs-api',
    toxiproxyPortName: process.env.KUBERNETES_TOXIPROXY_API_PORT || 'toxiproxy-api',
    swarmPortName: process.env.KUBERNETES_SWARM_PORT || 'swarm'
  },
  toxiproxy: {
    proxyName: 'ipfs_swarm'
  }
}
