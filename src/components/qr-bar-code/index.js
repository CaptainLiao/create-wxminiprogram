import {
  BarCode,
  QRCode
} from '../../libs/qr-bar-code/index'

const RATE  = wx.getSystemInfoSync().windowWidth / 750.0
let __qrcode = null

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },

  properties: {
    code: {
      type: String,
      value: '0'
    },
    qrcodewidth: {
      type: Number,
      value: 120
    },
    showQrcode: {
      type: Boolean,
      value: false
    }
  },

  lifetimes: {
    ready() {
      this.makeQrcode()
    }
  },

  methods: {
    makeQrcode() {
      const code = 0
      const qrcode_w = this.data.qrcodewidth * RATE
      __qrcode = new QRCode('qrcode', {
        width: qrcode_w,
        height: qrcode_w,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      })
      __qrcode.makeCode(code)
      BarCode('barcode', code, 600, 160)
    },
    tapCloseQrcode() {
      this.triggerEvent('closeModal')
    }
  }
})