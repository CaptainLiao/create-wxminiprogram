import AUTH from './auth'
import {CONFIG, HTTP_STATUS} from '../config'
import get from '../utils/get'

export function request(options) {
  options.url = `${CONFIG.host}${options.url}`

  if (!options.auth) return rowRequest(options)

  return AUTH.get()
    .then(({token} = {}) => {
      if (!options.header) options.header = {}
      options.header.token = `bearer ${token}`
      return rowRequest(options)
    })
    .catch(e => {
      if (get(e, 'code') == HTTP_STATUS.expired) {
        return AUTH.refresh().then(() => request(options))
      }

      throw e
    })
}

function rowRequest(options) {
  return wx.requestAsync(options)
    .then(res => {
      let code = get(res, 'data.code')
      if (code === HTTP_STATUS.error || code == HTTP_STATUS.expired) throw res.data
      
      return res
    })
}