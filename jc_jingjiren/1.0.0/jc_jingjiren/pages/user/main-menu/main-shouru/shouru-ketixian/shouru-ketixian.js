// pages/user/main-menu/main-shouru/shouru-ketixian/shouru-ketixian.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.globalData.baseUrlData,
    openid: app.globalData.openid,


    money_yu:'',
    money_all: '',
    money_daiqueren: '',
    money_tixianzhong: '',
    money_fenxiao:'',
    money_zhifan:'',
    parent: '',
    unicode: '',

    yongjin: app.globalData.yongjin
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.handleinit()
    that.setData({
      yongjin: app.globalData.yongjin
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
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    var that = this
    wx.showLoading({
      title: '数据更新中',
    })
    that.handleinit() // 更新账户余额相关
    setTimeout(function () {
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }, 1200)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 获取佣金余额
   */
  handleinit: function () {
    let that = this
    let baseUrlData = that.data.baseUrlData
    // 获取佣金余额
    wx.request({
      url: app.siteInfo.siteroot + '?i='+ app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-wallert',
      method: 'get',
      data: {
        openid: app.globalData.openid,
      },
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          money_yu: res.data.yu_money,
          money_all: res.data.all_money,
          money_daiqueren: res.data.daiqueren,
          money_tixianzhong: res.data.tixianzhong,
          money_fenxiao: res.data.fenxiao,
          money_zhifan: res.data.zhifan,
          parent: res.data.parent,
          unicode: res.data.onlyid
        })
      }
    })  
  },
  /**
  * 跳转
  */
  navigatetopage: function (e) {

    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  }
})