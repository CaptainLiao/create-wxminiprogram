import config from '../../config'

const APP = getApp()

Component ({
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },

  properties: {
    currentIndex: {
      type: Number,
      value: 0
    }
  },

  data: {
    tabBar: config && config.tabbar,
    tabStyle: {
      item: '',
      line: ''
    }
  },

  __tabItemWidth: 0,

  lifetimes: {
    attached() {
      let tabBar = this.data.tabBar
      this.__tabItemWidth = 100 / tabBar.length
      this.setData({
        tabStyle: {
          item: `width: ${this.__tabItemWidth}%`,
          line: `width: ${this.__tabItemWidth}%`
        }
      })
    }
  },

  methods: {
    tapTabBar(e) {
      let {index} = APP.getDataset(e)
      let w = this.__tabItemWidth

      this.setData({
        currentIndex: index,
        "tabStyle.line": `width: ${w}%;left: ${w * index}%`
      })
      wx.switchTab({url: `/${config.tabbar[index].pagePath}` })
    }
  },
})