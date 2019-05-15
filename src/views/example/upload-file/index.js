Page({
  data: {

  },

  tapUpload() {
    wx.chooseImageAsync()
      .then(res => {
        const tempFilePaths = res.tempFilePaths
        console.log(res);

        return wx.uploadFileAsync({
          url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            user: 'test'
          }
        })
      })
      .then(res => {
        const data = res.data
        console.log(data);
        
      })

  }
})