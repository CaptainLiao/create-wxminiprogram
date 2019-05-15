import QRCode from './qrcode'
import barcode from './barcode'

function convert_length(length) { 
  return Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
} 
function BarCode(id, code, width, height) { 
  barcode(wx.createCanvasContext(id), code, convert_length(width), convert_length(height)) 
} 
export {
  BarCode,
  QRCode
}
