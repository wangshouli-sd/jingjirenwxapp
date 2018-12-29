// pages/renwu/renwu-submit/renwu-xieyi/renwu-xieyi.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrlData: app.siteInfo.siteroot,
    patharr:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=base/show',
      method: 'get',
      data: {},
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          patharr: res.data
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
  // 预览图片
  makepreviewImage: function (e) {
    let that = this
    let url = e.currentTarget.dataset.url
    let urlsarr = that.data.patharr
    wx.previewImage({
      current: url,
      urls: urlsarr
    })
  }
})