"use strict"

const k8s = require('@kubernetes/client-node')

const kc = new k8s.KubeConfig()
kc.loadFromDefault()

const k8sApi = kc.makeApiClient(k8s.Core_v1Api)

async function main () {
  const res = await k8sApi.listNamespacedPod('default')
  console.log(JSON.stringify(res.body, null, 2))
}

main()
