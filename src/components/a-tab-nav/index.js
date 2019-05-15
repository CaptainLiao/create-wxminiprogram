const APP = getApp()

Component ({
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },

  properties: {
    tabNav: {
      type: Array,
      value: []
    }
  },

  data: {
    currentIndex: 0,
    tabStyle: {
      item: '',
      line: ''
    }
  },

  __tabItemWidth: 0,

  lifetimes: {
    attached() {
      let tabNav = this.data.tabNav
      this.__tabItemWidth = 100 / tabNav.length
      this.setData({
        tabStyle: {
          item: `width: ${this.__tabItemWidth}%`,
          line: `width: ${this.__tabItemWidth}%`
        }
      })
    }
  },

  methods: {
    tapTabNav(e) {
      let {index} = APP.getDataset(e)
      let w = this.__tabItemWidth

      this.setData({
        currentIndex: index,
        "tabStyle.line": `width: ${w}%;left: ${w * index}%`
      })

      this.triggerEvent('tabnavchange', {index, ...this.data.tabNav[index]})
    }
  },
})