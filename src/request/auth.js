import {
  getToken,
  login,
} from './auth-login'
import {HTTP_STATUS} from '../config'

const OND_DAY = 24 * 3600 * 1000
const TET = 'token_expired_time'

let __tokenPromise = null
let __tokenExpiredTime = wx.getStorageSync(TET)

export default {
  get,
  refresh,
  ensure
}

function get() {
  const needRefresh = Date.now() > __tokenExpiredTime

  return !__tokenPromise || needRefresh
    ? refresh()
    : __tokenPromise
}

function refresh() {
  return __tokenPromise = getToken().then(tokenRes => {
    __setTokenExpiredTime()
    return tokenRes
  })
}

function ensure() {
  return get().catch(e => {
    if (e && e.code == HTTP_STATUS.unlogin) {
      return __tokenPromise = login()
    }

    throw e
  })
}


// helper
function __setTokenExpiredTime() {
  __tokenExpiredTime = Date.now() + OND_DAY - 30*60*1000
  wx.setStorageSync(TET, __tokenExpiredTime)
}


