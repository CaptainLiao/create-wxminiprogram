import {request} from './request'
import {CONFIG} from '../config'

export default {
  login(code) {
    return request({
      method: 'GET',
      url: '',
      data: {code, appid: CONFIG.appId}
    })
  },
  loginWithUserInfo(userInfo) {
    let option = {
      sessionKey: wx.getStorageSync('sessionKey'),
      openid: wx.getStorageSync('openId'),
  
      appid: CONFIG.appId,
      brandId: CONFIG.brandId,
  
      signature: userInfo.signature,
      rawData: userInfo.rawData,
      encryptedData: userInfo.encryptedData,
      iv: userInfo.iv,
    }
    return request({
      method: 'GET',
      url: '',
      data: option
    })
  },
  // 获取手机验证码（领券时判断注册）
  getPhoneCode({phone}) {
    let data = 	{
      phone,
      appid: CONFIG.appId,
      brandId: CONFIG.brandId,
      chanel: CONFIG.chanel,
      maOpenId: wx.getStorageSync('openId'),
     }
    return request({
      method: 'POST',
      url: '',
      data
    })
  },
  register({phone, phoneCode}) {
    let data = 	{
      phone,
      phoneCode,
      appid: CONFIG.appId,
      brandId: CONFIG.brandId,
      chanel: CONFIG.chanel,
      maOpenId: wx.getStorageSync('openId'),
      unionId: wx.getStorageSync('unionId'),
     }
    return request({
      method: 'POST',
      url: '',
      data,
    })
  },

  //========== 业务相关 ==========//
}
