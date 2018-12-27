// pages/workbench/customer/customer-detail/detail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '', // 获取全局openid
    id: '',
    detail: {}, // 客户详情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let id = options.id
    app.getUserInfo(
      function(userInfo) {
        console.log(userInfo)
        that.setData({
          openid: userInfo.openid
        })
        console.log(that.data.openid)
      }
    )
    console.log(111)
    console.log(options.id)
    console.log(111)
    // that.getIndexInfo()
    // 客户详情

    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        m: 'jc_jingjiren',
        r: 'fr-member/customer-info',
        id: id,
      },
      success: function(res) {
        that.setData({
          detail: res.data,
          id: res.data.id
        })
        console.log(res.data)
        console.log(222)      
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function() {

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
  onShareAppMessage: function() {

  },

  /**
 *跳转详情页 
 **/
  navigateToDetail: function (e) {
    let url = e.currentTarget.dataset.url + '?id=' + e.currentTarget.dataset.id
    wx.navigateTo({
      url: url,
    })
  }
})