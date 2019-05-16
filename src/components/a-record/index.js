const recorderManager = wx.getRecorderManager()

Component({
  properties: {

  },

  data: {

  },

  attached() {
    recorderManager.onStop((res) => {
      const {tempFilePath, duration} = res
      console.log('recorder stop', res)

      this.triggerEvent('recordend', res)
    })
  },

  methods: {
    tapRecordStart() {
      const options = {
        duration: 10000,
        sampleRate: 44100,
        numberOfChannels: 1,
        encodeBitRate: 192000,
        format: 'aac',
        frameSize: 50
      }
      
      wx.showLoading()
      recorderManager.start(options)
    },
    tapRecordEnd() {
      wx.hideLoading()
      recorderManager.stop()
    }
  }
})
