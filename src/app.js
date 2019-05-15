//app.js
import './libs/promisifyWxApi'
import router from './libs/router/index'

import loading from './utils/loading'
import get from './utils/get'
import sleep from './utils/sleep'

App({
  onLaunch: function () {},
  globalData: {},
  router,
  loading,
  showToast,

  getDataset,
  handleException
})


function handleException(e) {
  if (!e) return
  console.error(e);
  
  return showToast({
    icon: 'none',
    title: e.message || e.errMsg || e.msg,
    duration: 2000
  })
}

function getDataset(e) {
  return get(e, 'currentTarget.dataset', {})
}

function showToast(obj = {}) {
  return wx.showToastAsync(obj)
    .then(() => sleep(obj.duration || 1500))
}
