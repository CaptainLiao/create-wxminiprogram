import API from '../../../request/api'
import get from '../../../utils/get'

const APP = getApp()
const NOOP = () => {}

let __register__token = ''
let __resolve = null
let __reject = null

Page({
  data: {
    phone: '',
    phoneCode: '',
    seconds: 0,
  },

  onLoad(q = {}) {
    let {
      resolve = NOOP,
      reject = NOOP
    } = APP.router.getParams(q.route_id) || {}

    __resolve = resolve
    __reject = reject
  },

  onUnload() {
    if (!__register__token) return __reject()
    return __resolve({token: __register__token})
  },

  onPhoneNum(e) {
    this.setData({
      phone: e.detail.value,
    })
  },
  onPhoneCode(e) {
    this.setData({
      phoneCode: e.detail.value,
    })
  },

  tapSubmitKeyboard () {

  },
  tapGotUserInfo(event) {
    let errMsg = this._validate(event)
    if (errMsg) return APP.handleException({message: errMsg})
    
    let {
      phone,
      phoneCode
    } = this.data

    return APP.loading(API.register({phone, phoneCode}))
      .then(res => {
        __register__token = get(res, 'data.token')
        return APP.showToast({ title: '登录成功' })
      })
      .then(() => APP.router.back())
      .catch(APP.handleException)
  },

  tapGetPhoneCode() {
    let phone = this.data.phone
    if (!phone) return APP.handleException({message: '手机号码有误'}) 

    this.data.seconds = 61
    this._countdown()

    return APP.loading(API.getPhoneCode({phone}))
      .then(res => {
        this.setData({
          phoneCode: get(res, 'data.phoneCode')
        })
      })
      .catch(e => APP.handleException(e))
  },

  _countdown() {
    let seconds = this.data.seconds

    if (seconds > 0) {
      seconds--
      setTimeout(() => {
        this._countdown()
      }, 1000)
    }
    if (seconds < 0) {
      seconds = 0
    }

    this.setData({
      seconds
    })
  },
  _validate(event) {
    let {
      phone,
      phoneCode
    } = this.data

    if (event && event.detail.errMsg.indexOf('ok') == -1) return '您拒绝了授权'
    if (!phone) return '手机号码有误'
    if (!phoneCode) return '请填写手机验证码'
  }
})