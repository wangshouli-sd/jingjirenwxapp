var app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {

    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.siteInfo.siteroot,
    detail:{},
    progress:[
      {
        title:"后台审核中",
        time:"18/08/29",
        complete: true
      },
      {
        title: "电话邀约",
        time: "18/08/29",
        complete: true
      },
      {
        title: "谈判",
        time: "18/08/29",
        complete: true
      },
      {
        title: "签约",
        time: "18/08/29",
        complete: true
      },
      {
        title: "首付款",
        time: "18/08/29",
        complete: false
      },
      {
        title: "制作",
        time: "18/08/29",
        complete: false
      },
      {
        title: "完成",
        time: "18/08/29",
        complete: false
      },
      {
        title: "付尾款",
        time: "18/08/29",
        complete: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      // 初始化详情
      wx.request({
        url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-task/one',
        method: 'get',
        data: {
          id: options.id
        },
        header: {
          'content-type': 'application/json' // 
        },
        success: function (res) {
          console.log(res.data.task)
          that.setData({
            detail:res.data.task
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 客服电话
   */
  makePhoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: app.globalData.kefuinfo.phone,
    })
  }
  
})