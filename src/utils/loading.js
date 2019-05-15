function loading(fn, title = '加载中...') {
  if (title) {
    wx.showLoading({ title })
  } else {
    wx.showLoading()
  }

  return Promise.resolve(fn).then(
    result => {
      wx.hideLoading()
      return result
    },
    error => {
      wx.hideLoading()
      throw error
    }
  )
}

export default loading
