import API from './api'
import get from '../utils/get'
import {CONFIG, HTTP_STATUS} from '../config'

export default {
  getToken() {
    return wx.loginAsync().then(({code, errMsg} = {}) => {
      if (!code) throw {code: HTTP_STATUS.error, message: `登录失败${errMsg}`}
  
      return API.login(code).then(res => {
        const {miniapp, token} = res.data
  
        wx.setStorageSync('openId', miniapp.openid)
        wx.setStorageSync('sessionKey', miniapp.sessionKey)
  
        if (token) return {token}
        throw {code: HTTP_STATUS.unlogin, message: '请登录'}
      })
    })
  },

  login() {
    return wx.getSettingAsync()
      .then(res => {
        if (res.authSetting['scope.userInfo']) {
          return wx.getUserInfoAsync({withCredentials: true})
            .then(res => __loginWithUserInfo(res))
        }
        
        return new Promise((resolve, reject) => getApp().router.push({
          path: CONFIG.authoriaztionUrl,
          params: {
            resolve,
            reject
          }
        }))
      })
  }
}

function __loginWithUserInfo(userInfo) {
  return API.loginWithUserInfo(userInfo)
    .then(({data}) => {
      const code = get(data, 'code')
      const token = get(data, 'token')
  
      if (token) return {token}
  
      throw {code, message: get(data, 'member', get(data, 'msg'))}
    })
    .catch(e => {
      if (e.code == HTTP_STATUS.unRegister) {
        wx.setStorageSync('unionId', get(e,'message.unionId'))
        wx.setStorageSync('openId', get(e,'message.maOpenId'))

        return new Promise((resolve, reject) => {
          return getApp().router.push({
            path: CONFIG.registerUrl,
            params: {
              resolve,
              reject
            }
          })
        })
      }

      throw e
    })
}