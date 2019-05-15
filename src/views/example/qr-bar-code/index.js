
import {
  BarCode,
  QRCode
} from '../../../libs/qr-bar-code/index'

const windowWidth = wx.getSystemInfoSync().windowWidth
const qrcode_w = 240 / (750.0 / windowWidth)


let __qrcode = new QRCode('qrcode', {
  width: qrcode_w,
  height: qrcode_w,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.H,
})

Page({
  data: {
    qrcodeWidth: qrcode_w,
    showQrcode: false,
  },

  onLoad() {
    __qrcode.makeCode(0)
  },


  tapShowQrcode() {
    this.setData({
      showQrcode: true
    })

    __qrcode.makeCode(0)
    BarCode('barcode', 0, 600, 160)
  },
  tapCloseQrcode() {
    this.setData({
      showQrcode: false
    })
  },
})