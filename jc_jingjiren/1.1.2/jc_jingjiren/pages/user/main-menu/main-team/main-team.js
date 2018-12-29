var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.globalData.baseUrlData,
    openid: app.globalData.openid,

    // tab参数
    tabs: ["一级", "二级"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    list_level1:[],
    level1total:'',
    list_level2: [],
    level2total: '',
    // list_page
    list_level1_page: 1,
    list_level1_size: 6,
    level1_stopRefresh: false,

    list_level2_page: 1,
    list_level2_size: 6,
    level2_stopRefresh: false,

    level: '0',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
      app.util.request({
        'url': 'entry/wxapp/index',
        'data': {
          m: 'jc_jingjiren',
          r: 'fr-distribution',
          openid: app.globalData.openid
        },   
      success: function (res) {
        console.log(res.data)
        that.setData({
          level: res.data.level
        })
        if (res.data.level != '0') {
          that.handleinit()
        }
      },
    })
  },
  handleinit: function () {
    let that = this
    // 获取下级列表
    console.log("获取下级")
    let levelvalue = that.data.level == '1' ? 2 : 3
    for (var i = 1; i < levelvalue; i++) {
      let list = 'list_level' + i
      let Refresh = 'level' + i + '_stopRefresh'
      let page = 'list_level' + i + '_page'
      let leveltotal = 'level' + i + 'total'
      let listdata = i == 1 ? that.data.list_level1 : that.data.list_level2
      let listpage = i == 1 ? that.data.list_level1_page : that.data.list_level2_page
      let listsize = i == 1 ? that.data.list_level1_size : that.data.list_level2_size

        app.util.request({
          'url': 'entry/wxapp/index',
          'data': {
            m: 'jc_jingjiren',
            r: 'fr-distribution/getson',
            openid: app.globalData.openid,
            type: i,
            page: listpage,
            size: listsize
          },  
        success: function (res) {
          console.log(res.data)
          if (res.data.page.current == res.data.page.next) {
            that.setData({
              [Refresh]: true
            })
          } else {
            that.setData({
              [page]: res.data.page.next
            })
          }
          that.setData({
            [list]: listdata.concat(res.data.list),
            [leveltotal]: res.data.page.data_total
          })
          console.log(res.data.page.data_total)
        },

      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 上拉刷新
    var that = this
    let activeIndex = that.data.activeIndex
    activeIndex++
    
    let list = 'list_level' + activeIndex
    let Refresh = 'level' + activeIndex + '_stopRefresh'
    let page = 'list_level' + activeIndex + '_page'
    let listdata = activeIndex == 1 ? that.data.list_level1 : that.data.list_level2
    let listpage = activeIndex == 1 ? that.data.list_level1_page : that.data.list_level2_page
    let listsize = activeIndex == 1 ? that.data.list_level1_size : that.data.list_level2_size

    let stopRefresh = activeIndex == 1 ? that.data.level1_stopRefresh : that.data.level2_stopRefresh 

    if (stopRefresh) {
      wx.showToast({
        title: '暂无更多数据',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
        app.util.request({
          'url': 'entry/wxapp/index',
          'data': {
            m: 'jc_jingjiren',
            r: 'fr-distribution/getson',
            openid: app.globalData.openid,
            type: activeIndex,
            page: listpage,
            size: listsize
          }, 
        success: function (res) {
          
          that.setData({
            [list]: listdata.concat(res.data.list),
          })
          if (res.data.page.current == res.data.page.next) {
            that.setData({
              [Refresh]: true
            })
          } else {
            that.setData({
              [page]: res.data.page.next
            })
            wx.showToast({
              title: '更新' + res.data.list.length + '条数据',
              icon: 'none',
              duration: 1000
            })
          }
          
        },
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
  * tab切换
  */
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
})