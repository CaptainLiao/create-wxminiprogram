let __params = {}
let __index = 0

function getId() {
  __index++
  return new Date().getTime() + '_' + __index
}

export default {
  push({ path, params }) {
    let id = getId()
    __params[id] = params

    return wx.navigateToAsync({
      url: `${path}?route_id=${id}`
    })
  },

  replace({ path, params }) {
    let id = getId()
    __params[id] = params

    return wx.redirectToAsync({
      url: `${path}?route_id=${id}`
    })
  },

  reLaunch({ path, params }) {
    // 清除所有数据
    __params = {}

    let id = getId()
    __params[id] = params

    return wx.reLaunchAsync({
      url: `${path}?route_id=${id}`
    })
  },

  back(option) {
    return wx.navigateBackAsync(option)
  },

  // 通过route_id获取对应的参数，一个id只能使用一次。
  // 在onLoad里调用并保存到Page实例上
  getParams(id) {
    let r = __params[id]
    __params[id] = undefined
    return r
  }
}
