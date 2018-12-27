// pages/user/main-shouru/main-shouru.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.globalData.baseUrlData,
    openid: app.globalData.openid,

    tixian: false,
    yongjin: app.globalData.yongjin
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      yongjin: app.globalData.yongjin
    })
      app.util.request({
        'url': 'entry/wxapp/index',
        'data': {
          m: 'jc_jingjiren',
          r: 'fr-getmoney/state',
          openid: app.globalData.openid
        }, 
      success: function (res) {
        console.log(res.data)
        if(res.data != "0"){
          that.setData({
            tixian: true
          })
        }
      }
    })  
    // 获取onlyid
      app.util.request({
        'url': 'entry/wxapp/index',
        'data': {
          m: 'jc_jingjiren',
          r: 'fr-wallert',
          openid: app.globalData.openid
        }, 
      success: function (res) {
        that.setData({
          onlyid: res.data.onlyid
        })
      }
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
   * 跳转
   */
  navigatetopage: function (e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  },
  navigatetofalse: function(e){
    wx.showModal({
      title: '提示',
      showCancel:false,
      content: '暂无提现中数据',
      success(res) {
        if (res.confirm) {
        }
      }
    })
  }
})