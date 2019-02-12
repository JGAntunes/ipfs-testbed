'use strict'

const url = require('url')
const request = require('superagent')

const config = require('../config')

function handleErrorCode (res) {
  const statusCode = res.status
  if (statusCode >= 400) {
    throw new Error(`Got ${statusCode} from toxiproxy client - ${JSON.stringify(res.body, null, 2)}`)
  }
}

async function getToxics ({ host, port }, { toxic, proxy = config.toxiproxy.proxyName } = {}) {
  const toxicName = toxic ? `/${toxic}` : ''
  const reqUrl = url.format({
    hostname: host,
    port,
    pathname: `/proxies/${proxy}/toxics${toxicName}`
  })
  const res = await request.get(reqUrl)
  handleErrorCode(res)
  return res.body
}

async function createToxic ({ host, port }, payload, { proxy = config.toxiproxy.proxyName } = {}) {
  const reqUrl = url.format({
    hostname: host,
    port,
    pathname: `/proxies/${proxy}/toxics`
  })
  const res = await request.post(reqUrl).send(payload)
  handleErrorCode(res)
  return res.body
}

async function deleteToxic ({ host, port }, toxic, { proxy = config.toxiproxy.proxyName } = {}) {
  const reqUrl = url.format({
    hostname: host,
    port,
    pathname: `/proxies/${proxy}/toxics/${toxic}`
  })
  const res = await request.delete(reqUrl)
  handleErrorCode(res)
  return res.body
}

module.exports = {
  getToxics,
  createToxic,
  deleteToxic
}
