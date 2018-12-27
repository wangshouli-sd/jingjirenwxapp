var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.siteInfo.siteroot,
    gglist: [],

    // 列表上拉刷新相关
    psize: 5,
    next: 1,
    stopRefresh: false,
    nomoredata: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.getNoticeList()
  },
  getNoticeList: function () {
    var that = this
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-notice/list',
      method: 'get',
      data: {
        size: that.data.psize,
        page: that.data.next
      },
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {

        console.log(res.data)
        let current = res.data.page.current
        let next = res.data.page.next
        if (current == next) {
          that.setData({
            nomoredata: true,
            stopRefresh: true
          })
        }
        that.setData({
          gglist: res.data.list,
          next: res.data.page.next
        })

      },
    })
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
    let that = this
    wx.showLoading({
      title: '数据更新中',
    })
    that.setData({
      psize: 6,
      next: 1,
      stopRefresh: false,
      nomoredata: false
    })
    that.getNoticeList()
    setTimeout(function () {
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }, 1200)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    let gglist = that.data.gglist
    let stopRefresh = that.data.stopRefresh
    let baseUrlData = that.data.baseUrlData
    console.log("触底")
    if (stopRefresh) {

      return wx.showToast({
        title: '暂无更多数据',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.request({
        url: app.siteInfo.siteroot + "app/index.php?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-notice/list",
        method: 'get',
        data: {
          size: that.data.psize,
          page: that.data.next
        },
        header: {
          'content-type': 'application/json' // 
        },
        success: function (res) {
          console.log(res.data)
          let current = res.data.page.current
          let next = res.data.page.next
          if (current == next) {
            that.setData({
              nomoredata: true,
              stopRefresh: true
            })
          }
          that.setData({
            gglist: gglist.concat(res.data.list),
            next: res.data.page.next,
          })
          wx.showToast({
            title: '更新' + res.data.list.length + '条数据',
            icon: 'none',
            duration: 1000
          })
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
  * 跳转页面
  */
  navigateTopage: function (e) {
    let url = e.currentTarget.dataset.url + "?id=" + e.currentTarget.dataset.id
    wx.navigateTo({
      url: url,
    })
  },
})