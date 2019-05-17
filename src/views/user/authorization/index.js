import config from '../../../config'
import get from '../../../utils/get'
import API from '../../../request/api'

const APP = getApp()
const NOOP = () => {}

let __register__token = ''
let __resolve = null
let __reject = null

Page({
  data: {
    showGetPhoneNumberButton: false
  },

  onLoad(q = {}) {
    let {
      showGetPhoneNumberButton,
      resolve = NOOP,
      reject = NOOP
    } = APP.router.getParams(q.route_id) || {} 

    __resolve = resolve
    __reject = reject
    this.setData({showGetPhoneNumberButton})
  },

  onUnload() {
    if (!__register__token) return __reject()
    return __resolve({token: __register__token})
  },

  onGotUserInfo({detail}) {
    if (detail.errMsg.indexOf('ok') == -1) {
      return APP.handleException({message: '您取消了授权'})
    }

    return APP.loading(this.rloginWithUserInfo(detail))
      .catch(APP.handleException)
  },

  tapGetPhoneNumber(e) {
    return APP.loading(this.rLoginWithWxPhone(e))
      .then(res => {
        __register__token = get(res, 'data.token')
        return APP.showToast({ title: '绑定成功' })
      })
      .then(() => {
        APP.router.back()
        throw null
      })
      .catch(e => {
        if (!e) throw null
        
        return new Promise((resolve, reject) => {
          return getApp().router.push({
            path: config.registerUrl,
            params: {
              resolve,
              reject
            }
          })
        })
      })
      .then(({token}) => {
        __register__token = token
        return APP.router.back()
      })
      .catch(APP.handleException)
  },

  rLoginWithWxPhone(e) {
    const errMsg = get(e, 'detail.errMsg')

    if (errMsg.indexOf('deny') > -1) return Promise.reject()

    if (errMsg.indexOf('ok') > -1) {
      this.setData({
        showGetPhoneNumberButton: false
      })
      
      return API.getPhoneNumber(e.detail)
        .then(res => API.register(res.data))
    }
    
    return Promise.reject({code: 'unBindWxPhone'})
  },

  rloginWithUserInfo(userInfo) {
    return API.loginWithUserInfo(userInfo)
      .then(({data}) => {
        let code = get(data, 'code')
        let token = get(data, 'token')
    
        if (token) {
          __register__token = token
          return APP.showToast({ title: '登录成功' })
        }
    
        throw {code, message: get(data, 'member', get(data, 'msg'))}
      })
      .then(() => APP.router.back())
      .catch(e => {
        if (e.code == '901') {
          wx.setStorageSync('unionId', get(e,'message.unionId'))
          wx.setStorageSync('openId', get(e,'message.maOpenId'))
          wx.setStorageSync('avatarUrl', get(e,'message.avatarUrl'))
  
          return this.setData({
            showGetPhoneNumberButton: true
          })
        }
  
        throw e
      })
  }
})